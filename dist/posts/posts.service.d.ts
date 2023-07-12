import { Posts } from './posts.model';
import { CreatePostDto } from './dto/create.post.dto';
import { User } from 'src/users/users.model';
import { VerifyPostDto } from './dto/verify.post.dto';
import { UsersService } from 'src/users/users.service';
export declare class PostsService {
    private postModel;
    private userModel;
    private userService;
    constructor(postModel: Posts, userModel: User, userService: UsersService);
    findAllPosts(req: any): Promise<any>;
    findNewPosts(req: any): Promise<any>;
    findMyPosts(req: any): Promise<any>;
    findAllAprovedPosts(): Promise<any>;
    findPostById(id: string): Promise<Posts>;
    createPost(post: CreatePostDto, req: any): Promise<Posts>;
    updatePost(post: CreatePostDto, id: string, req: any): Promise<Posts>;
    deletePost(id: string, req: any): Promise<Posts>;
    verifyPost(id: string, req: any, postUp: VerifyPostDto): Promise<Posts>;
    favoritePost(id: string, req: any): Promise<Posts>;
    viewPost(id: string): Promise<Posts>;
    findMyFavPosts(req: any): Promise<any>;
}
