import { Posts } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { VerifyPostDto } from 'src/posts/dto/verify.post.dto';
export declare class AdminService {
    private userModel;
    private postModel;
    private readonly usersService;
    constructor(userModel: User, postModel: Posts, usersService: UsersService);
    banUser(id: string, req: any): Promise<User>;
    setModerator(id: string, req: any): Promise<User>;
    delete(id: string, req: any): Promise<User>;
    findAll(req: any): Promise<User[]>;
    verifyPost(id: string, req: any, postUp: VerifyPostDto): Promise<Posts>;
    activePost(id: string, req: any): Promise<Posts>;
    findNewPosts(req: any): Promise<Posts[]>;
    addCategory(category: string, req: any): Promise<any>;
}
