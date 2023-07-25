/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Posts } from './posts.model';
import { InjectModel } from '@nestjs/mongoose';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { CreatePostDto } from './dto/create.post.dto';
import { User } from 'src/users/users.model';
import { VerifyPostDto } from './dto/verify.post.dto';
import { UsersService } from 'src/users/users.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: Posts,
    @InjectModel(User.name) private userModel: User,
    private userService: UsersService,
  ) {}

  async findAllPosts(req: any): Promise<Posts[]> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (user.role === 'admin' || user.role === 'moderator') {
        return await this.postModel.find().exec();
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async findNewPosts(req: any): Promise<Posts[]> {
    const user = await this.userService.findToken(req);
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

  async findMyPosts(req: any): Promise<Posts[]> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (user) {
        const post = await this.postModel.find({ 'owner.id': user.id });
        return post;
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async searchPosts(query: any): Promise<Posts[]> {
    const titleRegex = new RegExp(query.title, 'i');
    const descriptionRegex = new RegExp(query.description, 'i');
    const matchQuery = {
      title: { $regex: titleRegex },
      description: { $regex: descriptionRegex },
    };
    return this.postModel.find(matchQuery).exec();
  }

  async findUserPosts(id: string): Promise<Posts[]> {
    try {
      const post = await this.postModel.find({ 'owner.id': id });
      return post;
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async findAllApprovedPosts(): Promise<Posts[]> {
    try {
      const post = await this.postModel
        .find({ verify: 'approve', isActive: true })
        .exec();
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
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (user) {
        const createdPost = await this.postModel.create(post);
        createdPost.save();
        createdPost.owner = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          avatarURL: user.avatarURL,
          location: user.location,
        };

        return await this.postModel.findById(createdPost._id);
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async updatePost(post: CreatePostDto, id: string, req: any): Promise<Posts> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
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
    const user = await this.userService.findToken(req);
    const post = await this.postModel.findById({ _id: id });
    if (!user) {
      throw new Unauthorized('jwt expired');
    }

    try {
      if (user.role === 'admin' || user.role === 'moderator') {
        const find = await this.postModel.findByIdAndRemove({ _id: id }).exec();
        return find;
      } else if (post.owner.id === user.id) {
        const find = await this.postModel.findByIdAndRemove({ _id: id }).exec();
        return find;
      } else {
        throw new NotFound('Post or user not found');
      }
    } catch (e) {
      throw new NotFound('Post or user not found');
    }
  }

  async deleteComment(
    postId: string,
    commentId: string,
    req: any,
  ): Promise<Posts> {
    const user = await this.userService.findToken(req);
    const post = await this.postModel.findById({ _id: postId });
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (user.role === 'admin' || user.role === 'moderator') {
        const find = await this.postModel.findOneAndUpdate(
          { _id: postId },
          { $pull: { comments: { id: commentId } } },
          { new: true },
        );
        return find;
      } else if (post.owner.id === user.id) {
        const find = await this.postModel.findOneAndUpdate(
          { _id: postId },
          { $pull: { comments: { id: commentId } } },
          { new: true },
        );
        return find;
      } else {
        throw new NotFound('Comment or user not found');
      }
    } catch (e) {
      throw new NotFound('Comment or user not found');
    }
  }

  async deleteExchange(
    postId: string,
    exchangeId: string,
    req: any,
  ): Promise<Posts> {
    const user = await this.userService.findToken(req);
    const post = await this.postModel.findById({ _id: postId });
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (user.role === 'admin' || user.role === 'moderator') {
        const find = await this.postModel.findOneAndUpdate(
          { _id: postId },
          { $pull: { toExchange: { id: exchangeId } } },
          { new: true },
        );
        return find;
      } else if (post.owner.id === user.id) {
        const find = await this.postModel.findOneAndUpdate(
          { _id: postId },
          { $pull: { toExchange: { id: exchangeId } } },
          { new: true },
        );
        return find;
      } else if (post.toExchange[0].data.owner.id === user.id) {
        const find = await this.postModel.findOneAndUpdate(
          { _id: postId },
          { $pull: { toExchange: { id: exchangeId } } },
          { new: true },
        );
        return find;
      } else {
        throw new NotFound('Exchange not found');
      }
    } catch (e) {
      throw new NotFound('Exchange not found');
    }
  }

  async verifyPost(
    id: string,
    req: any,
    postUp: VerifyPostDto,
  ): Promise<Posts> {
    const admin = await this.userService.findToken(req);
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
    const user = await this.userService.findToken(req);
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

  async favoritePost(id: string, req: any): Promise<Posts> {
    const user = await this.userService.findToken(req);
    const post = await this.postModel.findById(id);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (!user || !post) {
        throw new Conflict('Not found');
      }

      if (user && post) {
        const array = post.favorite;
        const index = array.indexOf(user.id);
        if (index > -1) {
          array.splice(index, 1);
        } else {
          array.push(user.id);
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

  async findMyFavPosts(req: any): Promise<Posts[]> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const post = await this.postModel.find({ favorite: user.id }).exec();
      return post;
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async commentPosts(
    id: string,
    req: any,
    comments: CreateCommentDto,
  ): Promise<Posts> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const post = await this.postModel.findById(id);
      if (post) {
        comments.id = uuidv4();
        const { firstName, lastName, avatarURL, isOnline } = user;
        comments.user = { firstName, lastName, avatarURL, isOnline };
        comments.answer = [];
        const array = post.comments;
        array.push(comments);
        await this.postModel.updateOne(
          { _id: id },
          { $set: { comments: array } },
        );
        post.save();
        return await this.postModel.findById(id);
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async answerCommentPosts(
    postId: string,
    req: any,
    commentId: string,
    answer: CreateCommentDto,
  ): Promise<Posts> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const post = await this.postModel.findById(postId);
      if (post) {
        const comments = post.comments;
        const commentIndex = comments.findIndex(
          (comment: { id: string }) => comment.id === commentId,
        );
        if (commentIndex !== -1) {
          const answerArr = comments[commentIndex].answer;
          answer.id = uuidv4();
          const { firstName, lastName, avatarURL, isOnline } = user;
          answer.user = { firstName, lastName, avatarURL, isOnline };
          answerArr.push(answer);
          await this.postModel.updateOne(
            { _id: postId, 'comments.id': commentId },
            { $push: { 'comments.$.answer': answer } },
          );
          await post.save();
          return await this.postModel.findById(postId);
        }
      }
      throw new NotFound('Comment not found');
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async toExchangePosts(postId: string, userPostId: string, req: any) {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const post = await this.postModel.findById(postId);
      const userPost = await this.postModel.findById(userPostId);
      if (post) {
        const array = post.toExchange;
        array.push({ id: uuidv4(), agree: null, data: userPost });
        await this.postModel.updateOne(
          { _id: postId },
          { $set: { toExchange: array } },
        );
        post.save();
        return await this.postModel.findById(postId);
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async exchangeTruePosts(postId: string, userPostId: string, req: any) {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const updatedPost = await this.postModel.updateOne(
        { _id: postId, 'toExchange.id': userPostId },
        { $set: { 'toExchange.$.agree': true } },
      );

      if (updatedPost.nModified === 0) {
        throw new NotFound('Post or exchange item not found');
      }

      const updatedPostData = await this.postModel.findById(postId);
      return updatedPostData;
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async exchangeFalsePosts(postId: string, userPostId: string, req: any) {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const updatedPost = await this.postModel.updateOne(
        { _id: postId, 'toExchange.id': userPostId },
        { $set: { 'toExchange.$.agree': false } },
      );

      if (updatedPost.nModified === 0) {
        throw new NotFound('Post or exchange item not found');
      }

      const updatedPostData = await this.postModel.findById(postId);
      return updatedPostData;
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async findMyOwnPosts(req: any) {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const post = await this.postModel
        .find({ 'toExchange.data.owner.id': user.id })
        .exec();
      return post;
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }
}
