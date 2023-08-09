import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create.post.dto';
import { Posts } from './posts.model';
import { VerifyPostDto } from './dto/verify.post.dto';
import { CreateCommentDto } from './dto/create.comment.dto';
export declare class PostsController {
    private readonly postService;
    constructor(postService: PostsService);
    create(post: CreatePostDto, request: any): Promise<Posts>;
    findAll(request: any): Promise<Posts[]>;
    findNew(request: any): Promise<Posts[]>;
    findMy(request: any): Promise<Posts[]>;
    findUserPost(id: string): Promise<Posts[]>;
    findAllAprove(): Promise<Posts[]>;
    searchPosts(query: any): Promise<Posts[]>;
    findById(id: string): Promise<Posts>;
    update(post: CreatePostDto, request: any, id: string): Promise<Posts>;
    delete(id: string, request: any): Promise<Posts>;
    setVerify(post: VerifyPostDto, id: string, request: any): Promise<Posts>;
    setActive(id: string, request: any): Promise<Posts>;
    setFavorite(id: string, request: any): Promise<Posts>;
    setMyFavorite(request: any): Promise<Posts[]>;
    getMyExchenge(request: any): Promise<Posts[]>;
    setViews(id: string, request: any): Promise<Posts>;
    setComments(comments: CreateCommentDto, id: string, request: any): Promise<Posts>;
    deleteComment(postId: string, commentId: string, request: any): Promise<Posts>;
    setAnswerComments(answer: CreateCommentDto, postId: string, commentId: string, request: any): Promise<Posts>;
    setExchange(postId: string, userPostId: string, request: any): Promise<Posts>;
    deleteExchange(postId: string, exchangeId: string, request: any): Promise<Posts>;
    setExchangeTrue(postId: string, userPostId: string, request: any): Promise<object>;
    setExchangeFalse(postId: string, userPostId: string, request: any): Promise<Posts>;
}
