import { User } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { Posts } from 'src/posts/posts.model';
import { Orders } from 'src/orders/orders.model';
import { PasswordUserDto } from './dto/password.user.dto';
import * as sgMail from '@sendgrid/mail';
import { MailUserDto } from './dto/email.user.dto';
import { UpdatePasswordUserDto } from './dto/updatePassword.user.dto';
export declare class UsersService {
    private userModel;
    private postModel;
    private orderModel;
    constructor(userModel: User, postModel: Posts, orderModel: Orders);
    findById(id: string): Promise<User>;
    create(user: CreateUserDto): Promise<User>;
    sendVerificationEmail(email: string, verificationLink: string): Promise<void>;
    verifyUserEmail(id: any): Promise<void>;
    changePassword(req: any, newPass: PasswordUserDto): Promise<User>;
    restorePassword(email: MailUserDto): Promise<[sgMail.ClientResponse, {}]>;
    updateRestorePassword(id: string, newPass: UpdatePasswordUserDto): Promise<User>;
    login(user: CreateUserDto): Promise<User>;
    logout(req: any): Promise<User>;
    update(user: UpdateUserDto, req: any): Promise<User>;
    updateUserData(findId: string): Promise<Posts[]>;
    findOrCreateUser(googleId: string, firstName: string, email: string): Promise<any>;
    findToken(req: any): Promise<User>;
    createToken(authUser: {
        _id: string;
    }): Promise<any>;
    refreshAccessToken(req: any): Promise<User>;
}
