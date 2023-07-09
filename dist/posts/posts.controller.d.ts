import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create.post.dto';
import { Posts } from './posts.model';
export declare class PostsController {
    private readonly postService;
    constructor(postService: PostsService);
    create(post: CreatePostDto, request: any): Promise<Posts>;
    findAll(): Promise<Posts[]>;
    findById(id: string): Promise<Posts>;
    update(post: CreatePostDto, request: any, id: string): Promise<Posts>;
    delete(id: string, request: any): Promise<Posts>;
    setBan(id: string, request: any): Promise<Posts>;
}
