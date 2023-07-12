/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Posts } from './posts.model';
import { InjectModel } from '@nestjs/mongoose';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { CreatePostDto } from './dto/create.post.dto';
import { verify, JwtPayload } from 'jsonwebtoken';
import { User } from 'src/users/users.model';
import { VerifyPostDto } from './dto/verify.post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: Posts,
    @InjectModel(User.name) private userModel: User,
  ) {}

  async findAllPosts(req: any) {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.userModel.findById({ _id: findId.id });
      if (user.role === 'admin' || user.role === 'moderator') {
        return await this.postModel.find().exec();
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async findNewPosts(req: any) {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.userModel.findById({ _id: findId.id });
      if (user.role === 'admin' || user.role === 'moderator') {
        return await this.postModel.find({ verify: 'new' }).exec();
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async findMyPosts(req: any) {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.userModel.findById({ _id: findId.id });
      if (user) {
        const post = await this.postModel.find({ owner: findId.id }).exec();
        return post;
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async findAllAprovedPosts() {
    try {
      const post = await this.postModel.find({ verify: 'aprove' }).exec();
      return post;
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async findPostById(id: string): Promise<Posts> {
    try {
      const find = await this.postModel.findById(id).exec();
      return find;
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async createPost(post: CreatePostDto, req: any): Promise<Posts> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.userModel.findById(findId.id);
      if (user) {
        const createdPost = await this.postModel.create(post);
        createdPost.save();
        createdPost.owner = findId.id;

        return await this.postModel.findById(createdPost._id);
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async updatePost(post: CreatePostDto, id: string, req: any): Promise<Posts> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.userModel.findById({ _id: findId.id });
      if (user) {
        const { ...params } = post;
        await this.postModel.findByIdAndUpdate({ _id: id }, { ...params });
        const postUpdate = this.postModel.findById({ _id: id });
        return postUpdate;
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async deletePost(id: string, req: any): Promise<Posts> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.userModel.findById({ _id: findId.id });
      const post = await this.postModel.findById({ _id: id });
      if (user.role === 'admin' || user.role === 'moderator') {
        const find = await this.postModel.findByIdAndRemove({ _id: id }).exec();
        return find;
      }
      if (post.owner === user.id) {
        const find = await this.postModel.findByIdAndRemove({ _id: id }).exec();
        return find;
      }
      return;
    } catch (e) {
      throw new NotFound('Post or user not found');
    }
  }

  async verifyPost(
    id: string,
    req: any,
    postUp: VerifyPostDto,
  ): Promise<Posts> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const admin = await this.userModel.findById({ _id: findId.id });
      const post = await this.postModel.findById(id);

      if (!admin || !post) {
        throw new Conflict('Not found');
      }

      if (
        admin.role === 'admin' ||
        (admin.role === 'moderator' && post.verify === 'new')
      ) {
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

  async favoritePost(id: string, req: any): Promise<Posts> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.userModel.findById({ _id: findId.id });
      const post = await this.postModel.findById(id);

      if (!user || !post) {
        throw new Conflict('Not found');
      }

      if (user && post) {
        const array = post.favorite;
        const index = array.indexOf(id);
        if (index > -1) {
          array.splice(index, 1);
        } else {
          array.push(id);
        }
        await this.postModel.updateOne(
          { _id: id },
          { $set: { favorite: array } },
        );
        post.save();
        return await this.postModel.findById(id);
      } else {
        return post;
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async viewPost(id: string): Promise<Posts> {
    try {
      const post = await this.postModel.findById(id);

      if (!post) {
        throw new Conflict('Not found');
      }

      if (post) {
        post.views += 1;
        post.save();
        return await this.postModel.findById(id);
      } else {
        return await this.postModel.findById(id);
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }
}
