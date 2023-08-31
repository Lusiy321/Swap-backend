/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { Conflict, NotFound, Unauthorized, BadRequest } from 'http-errors';
import { UsersService } from 'src/users/users.service';
import { VerifyPostDto } from 'src/posts/dto/verify.post.dto';
import * as fs from 'fs';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: User,
    @InjectModel(Posts.name) private postModel: Posts,
    private readonly usersService: UsersService,
  ) {}

  async banUser(id: string, req: any): Promise<User> {
    const admin = await this.usersService.findToken(req);
    const newSub = await this.userModel.findById(id);
    if (!admin) {
      throw new Unauthorized('jwt expired');
    }

    if (!admin || !newSub) {
      throw new Conflict('User not found');
    }
    try {
      const adm = admin.role === 'admin' || admin.role === 'moderator';

      if (adm && newSub.ban === false) {
        newSub.ban = true;
        newSub.save();
        return this.userModel.findById(id);
      } else if (adm && newSub.ban === true) {
        newSub.ban = false;
        newSub.save();
        return this.userModel.findById(id);
      } else {
        return this.userModel.findById(id);
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async setModerator(id: string, req: any): Promise<User> {
    const admin = await this.usersService.findToken(req);
    const newSub = await this.userModel.findById(id).exec();
    if (!admin) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (!admin || !newSub) {
        throw new Conflict('User not found');
      }

      if (admin.role === 'admin' && newSub.role === 'user') {
        newSub.role = 'moderator';
        return newSub.save();
      } else if (admin.role === 'admin' && newSub.role === 'moderator') {
        newSub.role = 'user';
        return newSub.save();
      } else {
        throw new Conflict(
          'Only moderator and their subordinates can change user moderator',
        );
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async delete(id: string, req: any): Promise<User> {
    const user = await this.usersService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (user.role === 'admin') {
        const find = await this.userModel.findByIdAndRemove(id).exec();
        return find;
      } else {
        throw new Conflict('Only admin can delete user');
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findAll(req: any): Promise<User[]> {
    const user = await this.usersService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (user.role === 'admin') {
        return this.userModel.find().exec();
      } else if (user.role === 'moderator') {
        const subUsers = this.userModel
          .find({ $or: [{ _id: user._id }, { role: 'user' }] })
          .exec();
        return subUsers;
      } else {
        return await this.userModel.findById(user._id).exec();
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async verifyPost(
    id: string,
    req: any,
    postUp: VerifyPostDto,
  ): Promise<Posts> {
    const admin = await this.usersService.findToken(req);
    const post = await this.postModel.findById(id);
    if (!admin) {
      throw new Unauthorized('jwt expired');
    }

    if (!admin || !post) {
      throw new Conflict('Not found');
    }
    try {
      const adm = admin.role === 'admin' || admin.role === 'moderator';
      if (adm && post.verify === 'new') {
        const { ...params } = postUp;
        await this.postModel.findByIdAndUpdate({ _id: id }, { ...params });
        post.save();
        return await this.postModel.findById(id);
      } else {
        return post;
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async activePost(id: string, req: any): Promise<Posts> {
    const user = await this.usersService.findToken(req);
    const post = await this.postModel.findById(id);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    if (!user || !post) {
      throw new Conflict('Not found');
    }

    const own = user.id === post.owner.id;
    try {
      if (own && post.isActive === true) {
        await this.postModel.findByIdAndUpdate(
          { _id: id },
          { isActive: false },
        );
        post.save();
        return await this.postModel.findById(id);
      } else if (own && post.isActive === false) {
        await this.postModel.findByIdAndUpdate({ _id: id }, { isActive: true });
        post.save();
        return await this.postModel.findById(id);
      } else {
        return;
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findNewPosts(req: any): Promise<Posts[]> {
    const user = await this.usersService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (user.role === 'admin' || user.role === 'moderator') {
        return await this.postModel.find({ verify: 'new' }).exec();
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async addCategory(category: string, req: any) {
    const user = await this.usersService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    const filePath = 'src/posts/dto/category.json';
    const data = { [category]: category };
    try {
      if (user.role === 'admin') {
        const existingData = JSON.parse(
          await fs.promises.readFile(filePath, 'utf8'),
        );
        const updatedData = { ...existingData, ...data };

        await fs.promises.writeFile(
          filePath,
          JSON.stringify(updatedData, null, 2),
        );
        return updatedData;
      }
      throw new BadRequest('You are not admin');
    } catch (e) {
      throw new BadRequest('Unable value');
    }
  }
}
