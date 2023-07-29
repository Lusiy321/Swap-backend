import { User } from 'src/users/users.model';
import { UpdateUserDto } from '../dto/update.user.dto';
export declare function parseUser(user: User): Promise<UpdateUserDto>;
