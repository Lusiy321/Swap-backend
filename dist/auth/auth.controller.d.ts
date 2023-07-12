import { UsersService } from 'src/users/users.service';
export declare class AuthController {
    private readonly usersService;
    constructor(usersService: UsersService);
    [x: string]: any;
    handleLogin(): {
        msg: string;
    };
    googleAuthCallback(req: any, res: any): Promise<any>;
    user(request: any): {
        msg: string;
    };
    refresh(request: any): Promise<import("../users/users.model").User>;
}
