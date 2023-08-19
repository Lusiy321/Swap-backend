import { UsersService } from 'src/users/users.service';
import { PasswordUserDto } from 'src/users/dto/password.user.dto';
import { User } from 'src/users/users.model';
export declare class AuthController {
    private userModel;
    private readonly usersService;
    constructor(userModel: User, usersService: UsersService);
    [x: string]: any;
    googleLogin(): void;
    googleAuthRedirect(res: any, req: any): Promise<any>;
    user(request: any): Promise<{
        msg: string;
    }>;
    refresh(request: any): Promise<User>;
    cangePwd(request: any, password: PasswordUserDto): Promise<User>;
    verifyEmail(request: any): Promise<void>;
}
