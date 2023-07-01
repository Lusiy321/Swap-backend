import { Model } from 'mongoose';
import { User } from 'src/users/users.model';
export declare class AuthService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    findOrCreateUser(googleId: string, firstName: string, email: string): Promise<any>;
}
