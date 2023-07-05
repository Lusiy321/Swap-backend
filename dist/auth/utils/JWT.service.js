"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../../users/users.service");
let TokenService = class TokenService {
    constructor(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async generateAccessToken(userId) {
        const payload = { _id: userId };
        const options = { expiresIn: '15m' };
        return this.jwtService.signAsync(payload, options);
    }
    async refreshAccessToken(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const userId = decoded._id;
            const user = await this.userService.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const accessToken = await this.generateAccessToken(userId);
            return accessToken;
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
};
TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService])
], TokenService);
exports.TokenService = TokenService;
//# sourceMappingURL=JWT.service.js.map