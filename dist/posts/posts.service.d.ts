import { Posts } from './posts.model';
import { CreatePostDto } from './dto/create.post.dto';
import { User } from 'src/users/users.model';
export declare class PostsService {
    private postModel;
    private userModel;
    constructor(postModel: Posts, userModel: User);
    findAllPosts(): Promise<any>;
    findPostById(id: string): Promise<Posts>;
    createPost(post: CreatePostDto, req: any): Promise<Posts>;
    updatePost(post: CreatePostDto, id: string, req: any): Promise<Posts>;
    deletePost(id: string, req: any): Promise<Posts>;
    verifyPost(id: string, req: any): Promise<Posts>;
    favoritePost(id: string, req: any): Promise<Posts>;
}
