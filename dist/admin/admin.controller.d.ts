import { User } from 'src/users/users.model';
import { AdminService } from './admin.service';
import { VerifyPostDto } from 'src/posts/dto/verify.post.dto';
import { Posts } from 'src/posts/posts.model';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    [x: string]: any;
    setBan(id: string, request: any): Promise<User>;
    setRole(id: string, request: any): Promise<User>;
    delete(id: string, request: any): Promise<User>;
    findAll(request: any): Promise<User[]>;
    setVerify(post: VerifyPostDto, id: string, request: any): Promise<Posts>;
    findNew(request: any): Promise<Posts[]>;
    addCategory(category: string, request: any): Promise<void>;
}
