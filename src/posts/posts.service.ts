/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Posts } from './posts.model';
import { InjectModel } from '@nestjs/mongoose';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { CreatePostDto } from './dto/create.post.dto';
import { verify, JwtPayload } from 'jsonwebtoken';
import { User } from 'src/users/users.model';

@Injectable()
export class PostsService {
    userModel: User;
  constructor(@InjectModel(Posts.name) private postModel: Posts) {}

  async findAllPosts() {
    try {
        const post = await this.postModel.find().exec();
        return post
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
      const user = await this.userModel.findById({ _id: findId.id });
      if (user) {
      const createdPost = await this.postModel.create(post);
      createdPost.save();
        createdPost.owner = findId.id;
        createdPost.save();
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
          await this.postModel.findByIdAndUpdate({ _id: id }, { ...params },);
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
      const post = await this.postModel.findById({ _id: id })
      if (user.role === 'admin' || user.role === 'moderator') {
        const find = await this.postModel.findByIdAndRemove({ _id: id }).exec();
        return find;
        }  
      if (post.owner === user.id) {
        const find = await this.postModel.findByIdAndRemove({ _id: id }).exec();
        return find;
        } 
    return
    } catch (e) {
      throw new NotFound('Post or user not found');
    }
  }
    
  async verifyPost(id: string, req: any): Promise<Posts> {
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

      if (admin.role === 'admin' || admin.role === 'moderator' && post.verify === false) {
        post.verify = true;
        post.save();
        return await this.postModel.findById(id); 
      } else {
        return post;
      }      
    } catch (e) {
      throw new NotFound('User not found');
    }
  }


}
