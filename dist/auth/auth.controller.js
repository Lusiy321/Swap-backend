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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const Guards_1 = require("./utils/Guards");
const users_service_1 = require("../users/users.service");
const swagger_1 = require("@nestjs/swagger");
const google_user_dto_1 = require("../users/dto/google.user.dto");
const password_user_dto_1 = require("../users/dto/password.user.dto");
const mongoose_1 = require("@nestjs/mongoose");
const users_model_1 = require("../users/users.model");
const email_user_dto_1 = require("../users/dto/email.user.dto");
const updatePassword_user_dto_1 = require("../users/dto/updatePassword.user.dto");
let AuthController = class AuthController {
    constructor(userModel, usersService) {
        this.userModel = userModel;
        this.usersService = usersService;
    }
    googleLogin() {
        return;
    }
    async googleAuthRedirect(res, req) {
        const userId = req.user.id;
        const user = await this.userModel.findById(userId);
        return res.redirect(`https://my-app-hazel-nine.vercel.app/product/?token=${user.token}`);
    }
    async user(request) {
        if (request.user) {
            return { msg: 'Authenticated' };
        }
        else {
            return { msg: 'Not Authenticated' };
        }
    }
    async refresh(request) {
        return await this.usersService.refreshAccessToken(request);
    }
    async cangePwd(request, password) {
        return await this.usersService.changePassword(request, password);
    }
    async forgotPwd(email) {
        return await this.usersService.restorePassword(email);
    }
    async setUpdatePsw(id, password) {
        return this.usersService.updateRestorePassword(id, password);
    }
    async verifyEmail(id, res) {
        await this.usersService.verifyUserEmail(id);
        return res.redirect(`https://my-app-hazel-nine.vercel.app/account/profile`);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Login Google User' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: google_user_dto_1.GoogleUserDto }),
    (0, common_1.Get)('google/login'),
    (0, common_1.UseGuards)(Guards_1.GoogleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Google Authentication' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: google_user_dto_1.GoogleUserDto }),
    (0, common_1.Get)('google/redirect'),
    (0, common_1.UseGuards)(Guards_1.GoogleAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Google Authentication status' }),
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "user", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Refresh Access Token' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Refresh Access Token' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, password_user_dto_1.PasswordUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "cangePwd", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Forgot password email send' }),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_user_dto_1.MailUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPwd", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update password for forgot password',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, common_1.Post)('/update-password/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updatePassword_user_dto_1.UpdatePasswordUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setUpdatePsw", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify user email' }),
    (0, common_1.Patch)('verify-email/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [users_model_1.User,
        users_service_1.UsersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map