import { User } from 'src/users/users.model';
import { GoogleUserDto } from 'src/users/dto/google.user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private userModel;
    private readonly jwtService;
    private userService;
    static validateUser(): AuthService;
    constructor(userModel: User, jwtService: JwtService, userService: UsersService);
    validateUser(details: GoogleUserDto): Promise<any>;
    findUser(id: string): Promise<any>;
}
