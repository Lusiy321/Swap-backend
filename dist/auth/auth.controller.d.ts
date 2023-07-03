export declare class AuthController {
    [x: string]: any;
    handleLogin(): {
        msg: string;
    };
    googleAuthCallback(req: any, res: any): Promise<any>;
    user(request: any): {
        msg: string;
    };
}
