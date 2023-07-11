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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const posts_model_1 = require("./posts.model");
const mongoose_1 = require("@nestjs/mongoose");
const http_errors_1 = require("http-errors");
const jsonwebtoken_1 = require("jsonwebtoken");
const users_model_1 = require("../users/users.model");
let PostsService = class PostsService {
    constructor(postModel, userModel) {
        this.postModel = postModel;
        this.userModel = userModel;
    }
    async findAllPosts() {
        try {
            const post = await this.postModel.find().exec();
            return post;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async findPostById(id) {
        try {
            const find = await this.postModel.findById(id).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async createPost(post, req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const user = await this.userModel.findById(findId.id);
            if (user) {
                const createdPost = await this.postModel.create(post);
                createdPost.save();
                createdPost.owner = findId.id;
                return await this.postModel.findById(createdPost._id);
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async updatePost(post, id, req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const user = await this.userModel.findById({ _id: findId.id });
            if (user) {
                const params = __rest(post, []);
                await this.postModel.findByIdAndUpdate({ _id: id }, Object.assign({}, params));
                const postUpdate = this.postModel.findById({ _id: id });
                return postUpdate;
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async deletePost(id, req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const user = await this.userModel.findById({ _id: findId.id });
            const post = await this.postModel.findById({ _id: id });
            if (user.role === 'admin' || user.role === 'moderator') {
                const find = await this.postModel.findByIdAndRemove({ _id: id }).exec();
                return find;
            }
            if (post.owner === user.id) {
                const find = await this.postModel.findByIdAndRemove({ _id: id }).exec();
                return find;
            }
            return;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post or user not found');
        }
    }
    async verifyPost(id, req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const admin = await this.userModel.findById({ _id: findId.id });
            const post = await this.postModel.findById(id);
            if (!admin || !post) {
                throw new http_errors_1.Conflict('Not found');
            }
            if (admin.role === 'admin' || admin.role === 'moderator' && post.verify === 'new') {
                post.verify = 'aprove';
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
    async favoritePost(id, req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const user = await this.userModel.findById({ _id: findId.id });
            const post = await this.postModel.findById(id);
            if (!user || !post) {
                throw new http_errors_1.Conflict('Not found');
            }
            if (user && post) {
                const array = post.favorite;
                const index = array.indexOf(id);
                if (index > -1) {
                    array.splice(index, 1);
                }
                else {
                    array.push(id);
                }
                await this.postModel.updateOne({ _id: id, }, { $set: { favorite: array } });
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
};
PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(posts_model_1.Posts.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [posts_model_1.Posts, users_model_1.User])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map