import { User } from './users.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(user: CreateUserDto): Promise<User>;
    findById(id: string): Promise<User>;
    login(user: CreateUserDto): Promise<User>;
    logout(request: any): Promise<User>;
    update(user: UpdateUserDto, request: any): Promise<User>;
}
