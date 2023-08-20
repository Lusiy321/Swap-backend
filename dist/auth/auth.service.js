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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_model_1 = require("../users/users.model");
const http_errors_1 = require("http-errors");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    static validateUser() {
        throw new Error('Method not implemented.');
    }
    constructor(userModel, jwtService, userService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async validateUser(details) {
        const user = await this.userModel.findOne({ googleId: details.googleId });
        try {
            if (user === null) {
                const newUser = await this.userModel.create(details);
                newUser.save();
                const userUpdateToken = await this.userModel.findOne({
                    email: details.email,
                });
                await this.userService.createToken(userUpdateToken);
                return await this.userModel.findById({
                    _id: userUpdateToken._id,
                });
            }
            await this.userService.createToken(user);
            return await this.userModel.findOne({
                _id: user.id,
            });
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async findUser(id) {
        const user = await this.userModel.findById(id);
        return user;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [users_model_1.User,
        jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map