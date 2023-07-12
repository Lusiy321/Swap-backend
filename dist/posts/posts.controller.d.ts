import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create.post.dto';
import { Posts } from './posts.model';
import { VerifyPostDto } from './dto/verify.post.dto';
export declare class PostsController {
    private readonly postService;
    constructor(postService: PostsService);
    create(post: CreatePostDto, request: any): Promise<Posts>;
    findAll(request: any): Promise<Posts[]>;
    findNew(request: any): Promise<Posts[]>;
    findMy(request: any): Promise<Posts[]>;
    findAllAprove(): Promise<Posts[]>;
    findById(id: string): Promise<Posts>;
    update(post: CreatePostDto, request: any, id: string): Promise<Posts>;
    delete(id: string, request: any): Promise<Posts>;
    setVerify(post: VerifyPostDto, id: string, request: any): Promise<Posts>;
    setFavorite(id: string, request: any): Promise<Posts>;
    setMyFavorite(request: any): Promise<Posts[]>;
    setViews(id: string): Promise<Posts>;
}
