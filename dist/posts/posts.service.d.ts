/// <reference types="http-errors" />
import { Posts } from './posts.model';
import { CreatePostDto } from './dto/create.post.dto';
import { VerifyPostDto } from './dto/verify.post.dto';
import { UsersService } from 'src/users/users.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { OrderService } from 'src/orders/orders.service';
import { Orders } from 'src/orders/orders.model';
export declare class PostsService {
    private postModel;
    private orderModel;
    private userService;
    private orderService;
    constructor(postModel: Posts, orderModel: Orders, userService: UsersService, orderService: OrderService);
    findAllPosts(req: any): Promise<Posts[]>;
    findNewPosts(req: any): Promise<Posts[]>;
    findMyPosts(req: any): Promise<Posts[]>;
    searchPosts(query: any): Promise<Posts[]>;
    findUserPosts(id: string): Promise<Posts[]>;
    findAllApprovedPosts(): Promise<Posts[]>;
    findPostById(id: string): Promise<Posts>;
    createPost(post: CreatePostDto, req: any): Promise<Posts>;
    updatePost(post: CreatePostDto, id: string, req: any): Promise<Posts>;
    updatePostData(findId: string): Promise<Posts[]>;
    deletePost(id: string, req: any): Promise<Posts>;
    removePostData(findId: string): Promise<Posts[]>;
    deleteComment(postId: string, commentId: string, req: any): Promise<Posts>;
    deleteExchange(postId: string, exchangeId: string, req: any): Promise<Posts>;
    verifyPost(id: string, req: any, postUp: VerifyPostDto): Promise<Posts>;
    activePost(id: string, req: any): Promise<Posts>;
    favoritePost(id: string, req: any): Promise<Posts>;
    viewPost(id: string, req: any): Promise<Posts>;
    findMyFavPosts(req: any): Promise<Posts[]>;
    commentPosts(postId: string, req: any, comments: CreateCommentDto): Promise<Posts>;
    answerCommentPosts(postId: string, req: any, commentId: string, answer: CreateCommentDto): Promise<Posts>;
    toExchangePosts(postId: string, userPostId: string, req: any): Promise<Posts>;
    exchangeTruePosts(postId: string, userPostId: string, req: any): Promise<import("http-errors").HttpError<404> | {
        data: any;
        orderId: any;
    }>;
    exchangeFalsePosts(postId: string, userPostId: string, req: any): Promise<any>;
    findMyOwnPosts(req: any): Promise<any>;
}
