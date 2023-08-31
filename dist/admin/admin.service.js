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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const posts_model_1 = require("../posts/posts.model");
const users_model_1 = require("../users/users.model");
const http_errors_1 = require("http-errors");
const users_service_1 = require("../users/users.service");
const fs = require("fs");
let AdminService = class AdminService {
    constructor(userModel, postModel, usersService) {
        this.userModel = userModel;
        this.postModel = postModel;
        this.usersService = usersService;
    }
    async banUser(id, req) {
        const admin = await this.usersService.findToken(req);
        const newSub = await this.userModel.findById(id);
        if (!admin) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        if (!admin || !newSub) {
            throw new http_errors_1.Conflict('User not found');
        }
        try {
            const adm = admin.role === 'admin' || admin.role === 'moderator';
            if (adm && newSub.ban === false) {
                newSub.ban = true;
                newSub.save();
                return this.userModel.findById(id);
            }
            else if (adm && newSub.ban === true) {
                newSub.ban = false;
                newSub.save();
                return this.userModel.findById(id);
            }
            else {
                return this.userModel.findById(id);
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async setModerator(id, req) {
        const admin = await this.usersService.findToken(req);
        const newSub = await this.userModel.findById(id).exec();
        if (!admin) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (!admin || !newSub) {
                throw new http_errors_1.Conflict('User not found');
            }
            if (admin.role === 'admin' && newSub.role === 'user') {
                newSub.role = 'moderator';
                return newSub.save();
            }
            else if (admin.role === 'admin' && newSub.role === 'moderator') {
                newSub.role = 'user';
                return newSub.save();
            }
            else {
                throw new http_errors_1.Conflict('Only moderator and their subordinates can change user moderator');
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async delete(id, req) {
        const user = await this.usersService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (user.role === 'admin') {
                const find = await this.userModel.findByIdAndRemove(id).exec();
                return find;
            }
            else {
                throw new http_errors_1.Conflict('Only admin can delete user');
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async findAll(req) {
        const user = await this.usersService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (user.role === 'admin') {
                return this.userModel.find().exec();
            }
            else if (user.role === 'moderator') {
                const subUsers = this.userModel
                    .find({ $or: [{ _id: user._id }, { role: 'user' }] })
                    .exec();
                return subUsers;
            }
            else {
                return await this.userModel.findById(user._id).exec();
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async verifyPost(id, req, postUp) {
        const admin = await this.usersService.findToken(req);
        const post = await this.postModel.findById(id);
        if (!admin) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        if (!admin || !post) {
            throw new http_errors_1.Conflict('Not found');
        }
        try {
            const adm = admin.role === 'admin' || admin.role === 'moderator';
            if (adm && post.verify === 'new') {
                const params = __rest(postUp, []);
                await this.postModel.findByIdAndUpdate({ _id: id }, Object.assign({}, params));
                post.save();
                return await this.postModel.findById(id);
            }
            else {
                return post;
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async activePost(id, req) {
        const user = await this.usersService.findToken(req);
        const post = await this.postModel.findById(id);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        if (!user || !post) {
            throw new http_errors_1.Conflict('Not found');
        }
        const own = user.id === post.owner.id;
        try {
            if (own && post.isActive === true) {
                await this.postModel.findByIdAndUpdate({ _id: id }, { isActive: false });
                post.save();
                return await this.postModel.findById(id);
            }
            else if (own && post.isActive === false) {
                await this.postModel.findByIdAndUpdate({ _id: id }, { isActive: true });
                post.save();
                return await this.postModel.findById(id);
            }
            else {
                return;
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async findNewPosts(req) {
        const user = await this.usersService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (user.role === 'admin' || user.role === 'moderator') {
                return await this.postModel.find({ verify: 'new' }).exec();
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async addCategory(category, req) {
        const user = await this.usersService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        const filePath = 'src/posts/dto/category.json';
        const data = { [category]: category };
        try {
            if (user.role === 'admin') {
                const existingData = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
                const updatedData = Object.assign(Object.assign({}, existingData), data);
                await fs.promises.writeFile(filePath, JSON.stringify(updatedData, null, 2));
                return updatedData;
            }
            throw new http_errors_1.BadRequest('You are not admin');
        }
        catch (e) {
            throw new http_errors_1.BadRequest('Unable value');
        }
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(posts_model_1.Posts.name)),
    __metadata("design:paramtypes", [users_model_1.User,
        posts_model_1.Posts,
        users_service_1.UsersService])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map