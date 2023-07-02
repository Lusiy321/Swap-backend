export declare class AuthController {
    [x: string]: any;
    handleLogin(): {
        msg: string;
    };
    handleRedirect(): Promise<{
        msg: string;
    }>;
    user(request: any): {
        msg: string;
    };
}
