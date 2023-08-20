import { UsersService } from 'src/users/users.service';
import { PasswordUserDto } from 'src/users/dto/password.user.dto';
import { User } from 'src/users/users.model';
import { MailUserDto } from 'src/users/dto/email.user.dto';
import { UpdatePasswordUserDto } from 'src/users/dto/updatePassword.user.dto';
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
    forgotPwd(email: MailUserDto): Promise<[import("@sendgrid/mail").ClientResponse, {}]>;
    setUpdatePsw(id: string, password: UpdatePasswordUserDto): Promise<User>;
    verifyEmail(id: string, res: any): Promise<any>;
}
