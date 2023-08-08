import { UsersService } from 'src/users/users.service';
export declare class AuthController {
    private readonly usersService;
    constructor(usersService: UsersService);
    [x: string]: any;
    handleLogin(): {
        msg: string;
    };
    googleAuthRedirect(req: any): Promise<{
        token: any;
    }>;
    user(request: any): Promise<{
        msg: string;
    }>;
    refresh(request: any): Promise<import("../users/users.model").User>;
}
