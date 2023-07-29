import { User } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { GoogleUserDto } from './dto/google.user.dto';
import { Posts } from 'src/posts/posts.model';
export declare class UsersService {
    private userModel;
    private postModel;
    constructor(userModel: User, postModel: Posts);
    findAll(req: any): Promise<User[]>;
    findById(id: string): Promise<User>;
    create(user: CreateUserDto): Promise<User>;
    login(user: CreateUserDto): Promise<User>;
    GoogleLogin(user: GoogleUserDto): Promise<User>;
    logout(req: any): Promise<User>;
    update(user: UpdateUserDto, req: any): Promise<User>;
    updateUserData(findId: string): Promise<Posts[]>;
    delete(id: string, req: any): Promise<User>;
    setModerator(id: string, req: any): Promise<User>;
    banUser(id: string, req: any): Promise<User>;
    findOrCreateUser(googleId: string, firstName: string, email: string): Promise<any>;
    findToken(req: any): Promise<User>;
    createToken(authUser: {
        _id: string;
    }): Promise<any>;
    refreshAccessToken(req: any): Promise<User>;
}
