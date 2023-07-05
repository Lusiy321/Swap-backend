import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
export declare class TokenService {
    private readonly jwtService;
    private readonly userService;
    constructor(jwtService: JwtService, userService: UsersService);
    generateAccessToken(userId: string): Promise<string>;
    refreshAccessToken(refreshToken: string): Promise<string>;
}
