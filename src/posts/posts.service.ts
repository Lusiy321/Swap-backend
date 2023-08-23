/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Posts } from './posts.model';
import { InjectModel } from '@nestjs/mongoose';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { CreatePostDto } from './dto/create.post.dto';
import { VerifyPostDto } from './dto/verify.post.dto';
import { UsersService } from 'src/users/users.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { v4 as uuidv4 } from 'uuid';
import { OrderService } from 'src/orders/orders.service';
import { Orders } from 'src/orders/orders.model';
import { CategoryPostDto, categoryList } from './dto/category.post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: Posts,
    @InjectModel(Orders.name) private orderModel: Orders,
    private userService: UsersService,
    private orderService: OrderService,
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
    const { req } = query;
    try {
      const searchItem = req;
      if (searchItem === '') {
        throw new NotFound('Post not found');
      }
      const regex = new RegExp(searchItem, 'i');
      const find = await this.postModel
        .find({ title: { $regex: regex } })
        .exec();
      if (Array.isArray(find) && find.length === 0) {
        const descr = await this.postModel
          .find({ description: { $regex: regex } })
          .exec();
        if (Array.isArray(descr) && descr.length === 0) {
          throw new NotFound('Post not found');
        }
        return descr;
      } else {
        return find;
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
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
        .sort({ createdAt: -1 })
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
      throw new NotFound('Post Not found');
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
        this.updatePostData(id);
        return this.postModel.findById({ _id: id });
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async updatePostData(findId: string): Promise<Posts[]> {
    const post = await this.postModel.findById({ _id: findId });

    await this.postModel.updateMany(
      { 'toExchange.data.id': post.id },
      {
        $set: {
          'toExchange.$[toExchange].data': {
            id: post.id,
            title: post.title,
            description: post.description,
            img: post.img,
            price: post.price,
          },
        },
      },
      { arrayFilters: [{ 'toExchange.data.id': post.id }] },
    );

    await this.orderModel.updateMany(
      { product: { _id: post.id } },
      {
        $set: {
          product: post,
        },
      },
    );
    await this.orderModel.updateMany(
      { offer: { _id: post.id } },
      {
        $set: {
          offer: post,
        },
      },
    );
    return;
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
        await this.removePostData(id);
        return find;
      } else {
        throw new NotFound('Post or user not found');
      }
    } catch (e) {
      throw new NotFound('Post or user not found');
    }
  }

  async removePostData(findId: string): Promise<Posts[]> {
    await this.postModel.updateMany(
      { 'toExchange.data.id': findId },
      { $pull: { 'toExchange.data': { id: findId } } },
      { new: true },
      { arrayFilters: [{ 'toExchange.data.id': findId }] },
    );

    return;
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
    const commentArr = post.comments;
    const foundUser = function findInToExchange(
      commentArr: any[],
      ownerId: string,
    ) {
      const foundItem = commentArr.find((item) => item.user.id === ownerId);
      return foundItem ? foundItem.user.id : null;
    };
    try {
      if (user.role === 'admin' || user.role === 'moderator') {
        const find = await this.postModel.findOneAndUpdate(
          { _id: postId },
          { $pull: { comments: { id: commentId } } },
          { new: true },
        );
        return find;
      } else if (foundUser(commentArr, user.id) === user.id) {
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
    const ownerId = user.id;
    const toExchangeArray = post.toExchange;

    const foundUser = function findInToExchange(
      toExchangeArray: any[],
      ownerId: string,
    ) {
      const foundItem = toExchangeArray.find(
        (item) => item.user.id === ownerId,
      );
      return foundItem ? foundItem.user.id : null;
    };

    if (foundUser(toExchangeArray, ownerId) === null) {
      throw new NotFound('Exchange not found');
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
      } else if (foundUser(toExchangeArray, ownerId) === user.id) {
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

  async viewPost(id: string, req: any): Promise<Posts> {
    const post = await this.postModel.findById(id);
    const user = await this.userService.findToken(req);
    if (!post) {
      throw new Conflict('Not found');
    }
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (post) {
        if (post.owner.id === user.id) {
          return await this.postModel.findById(id);
        }
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
    postId: string,
    req: any,
    comments: CreateCommentDto,
  ): Promise<Posts> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }

    try {
      const post = await this.postModel.findById(postId);
      if (post) {
        const { id, firstName, lastName, phone, avatarURL, location } = user;
        comments.user = {
          id,
          firstName,
          lastName,
          phone,
          avatarURL,
          location,
        };
        comments.id = uuidv4();
        comments.answer = [];
        const array = post.comments;
        array.push(comments);
        await this.postModel.updateOne(
          { _id: postId },
          { $set: { chat: array } },
        );
        return await this.postModel.findById(postId);
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
          const { id, firstName, lastName, phone, avatarURL, location } = user;
          answer.user = { id, firstName, lastName, phone, avatarURL, location };
          answerArr.push(answer);
          await this.postModel.updateOne(
            { _id: postId, 'comments.id': commentId },
            { $push: { 'comments.$.answer': answer } },
          );
          return await this.postModel.findById(postId);
        }
      }
      throw new NotFound('Comment not found');
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async toExchangePosts(
    postId: string,
    userPostId: string,
    req: any,
  ): Promise<Posts> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFound('Post not found');
    }

    const userPost = await this.postModel.findById(userPostId);
    if (!userPost) {
      throw new NotFound('Post not found');
    }
    const foundUser = function findInToExchange(
      toExchangeArray: any[],
      ownerId: string,
    ) {
      const foundItem = toExchangeArray.find(
        (item) => item.data.id === ownerId,
      );
      return foundItem ? foundItem.data.id : null;
    };

    const orderProduct = await this.orderModel.findOne({
      $and: [
        { 'product._id': { $eq: postId } },
        { 'offer._id': { $eq: userPostId } },
      ],
    });
    const orderOffer = await this.orderModel.findOne({
      $and: [
        { 'product._id': { $eq: userPostId } },
        { 'offer._id': { $eq: postId } },
      ],
    });
    const toExchangeFind = await this.postModel.findOne({
      $and: [
        { _id: { $eq: userPostId } },
        { 'toExchange.data.id': { $eq: postId } },
      ],
    });
    if (userPost.verify === 'approve') {
      if (
        foundUser(post.toExchange, userPost.id) === null &&
        orderProduct === null &&
        orderOffer === null &&
        toExchangeFind === null
      ) {
        const exchId = uuidv4();
        const array = post.toExchange;
        array.push({
          id: exchId,
          agree: null,
          data: {
            id: userPost.id,
            title: userPost.title,
            description: userPost.description,
            img: userPost.img,
            price: userPost.price,
          },
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarURL: user.avatarURL,
            location: user.location,
          },
        });

        await this.postModel.updateOne(
          { _id: postId },
          { $set: { toExchange: array } },
        );
        const newPost = await this.postModel.findById(postId);
        return newPost;
      } else {
        throw new NotFound('Offer already exist');
      }
    }
  }

  async exchangeTruePosts(postId: string, userPostId: string, req: any) {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }

    const order = await this.orderModel.findOne({
      $and: [
        { 'product._id': { $eq: postId } },
        { 'offer._id': { $eq: userPostId } },
      ],
    });

    try {
      if (order === null) {
        await this.orderService.createOrder(postId, userPostId);
        const updatedPost = await this.postModel.updateOne(
          { _id: postId, 'toExchange.data.id': userPostId },
          { $pull: { toExchange: { 'data.id': userPostId } } },
          { new: true },
        );
        if (updatedPost.nModified === 0) {
          throw new NotFound('Post or exchange item not found');
        }
      } else {
        return new NotFound('Post exist');
      }
      const newOrder = await this.orderModel.findOne({
        $and: [
          { 'product._id': { $eq: postId } },
          { 'offer._id': { $eq: userPostId } },
        ],
      });
      const updatedPostData = await this.postModel.findById(postId);
      return { data: updatedPostData, orderId: newOrder.id };
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
        { _id: postId, 'toExchange.data.id': userPostId },
        { $pull: { toExchange: { 'data.id': userPostId } } },
        { new: true },
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
        .find({ 'toExchange.user.id': user.id })
        .exec();
      return post;
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async setCategoryPosts(
    postId: string,
    req: any,
    setCategory: CategoryPostDto,
  ): Promise<Posts> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    const { category } = setCategory;
    try {
      if (user || user.role === 'admin' || user.role === 'moderator') {
        const post = await this.postModel.findById(postId);
        if (post) {
          await this.postModel.updateOne(
            { _id: postId },
            { $set: { category: category } },
          );
          return await this.postModel.findById(postId);
        } else {
          throw new NotFound('Post not found');
        }
      } else {
        throw new NotFound('User not found');
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async getCategory() {
    const category = [...Object.values(categoryList)];
    return category;
  }
}
