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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_model_1 = require("../users/users.model");
const admin_service_1 = require("./admin.service");
const verify_post_dto_1 = require("../posts/dto/verify.post.dto");
const posts_model_1 = require("../posts/posts.model");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async setBan(id, request) {
        return this.adminService.banUser(id, request);
    }
    async setRole(id, request) {
        return this.adminService.setModerator(id, request);
    }
    async delete(id, request) {
        return this.adminService.delete(id, request);
    }
    async findAll(request) {
        return this.adminService.findAll(request);
    }
    async setVerify(post, id, request) {
        return this.adminService.verifyPost(id, request, post);
    }
    async findNew(request) {
        return this.adminService.findNewPosts(request);
    }
    async addCategory(category, request) {
        return this.adminService.addCategory(category, request);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Set ban user' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('/ban/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setBan", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Set moderator' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('/role/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setRole", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delet user' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get All Users' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [users_model_1.User] }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Verify user enum: [new, aprove, rejected]',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('/verify/:Id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('Id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_post_dto_1.VerifyPostDto, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setVerify", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get new Post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [posts_model_1.Posts] }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Get)('/new'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findNew", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Add category',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('/category/add/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addCategory", null);
AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map