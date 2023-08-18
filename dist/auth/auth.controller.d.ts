import { UsersService } from 'src/users/users.service';
import { PasswordUserDto } from 'src/users/dto/password.user.dto';
export declare class AuthController {
    private readonly usersService;
    constructor(usersService: UsersService);
    [x: string]: any;
    googleAuthRedirect(res: any, req: any): Promise<any>;
    user(request: any): Promise<{
        msg: string;
    }>;
    refresh(request: any): Promise<import("../users/users.model").User>;
    cangePwd(request: any, password: PasswordUserDto): Promise<import("../users/users.model").User>;
    verifyEmail(request: any): Promise<void>;
}
