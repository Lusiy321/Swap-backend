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
const users_model_1 = require("../users/users.model");
const users_service_1 = require("../users/users.service");
const uuid_1 = require("uuid");
let PostsService = class PostsService {
    constructor(postModel, userModel, userService) {
        this.postModel = postModel;
        this.userModel = userModel;
        this.userService = userService;
    }
    async findAllPosts(req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (user.role === 'admin' || user.role === 'moderator') {
                return await this.postModel.find().exec();
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async findNewPosts(req) {
        const user = await this.userService.findToken(req);
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
    async findMyPosts(req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (user) {
                const post = await this.postModel.find({ 'owner.id': user.id });
                return post;
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async searchPosts(query) {
        const titleRegex = new RegExp(query.title, 'i');
        const descriptionRegex = new RegExp(query.description, 'i');
        const matchQuery = {
            title: { $regex: titleRegex },
            description: { $regex: descriptionRegex },
        };
        return this.postModel.find(matchQuery).exec();
    }
    async findUserPosts(id) {
        try {
            const post = await this.postModel.find({ 'owner.id': id });
            return post;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async findAllApprovedPosts() {
        try {
            const post = await this.postModel
                .find({ verify: 'approve', isActive: true })
                .exec();
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
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (user) {
                const createdPost = await this.postModel.create(post);
                createdPost.save();
                createdPost.owner = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    avatarURL: user.avatarURL,
                    location: user.location,
                };
                return await this.postModel.findById(createdPost._id);
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async updatePost(post, id, req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (user) {
                const params = __rest(post, []);
                await this.postModel.findByIdAndUpdate({ _id: id }, Object.assign({}, params));
                return this.postModel.findById({ _id: id });
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async deletePost(id, req) {
        const user = await this.userService.findToken(req);
        const post = await this.postModel.findById({ _id: id });
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (user.role === 'admin' || user.role === 'moderator') {
                const find = await this.postModel.findByIdAndRemove({ _id: id }).exec();
                return find;
            }
            else if (post.owner.id === user.id) {
                const find = await this.postModel.findByIdAndRemove({ _id: id }).exec();
                return find;
            }
            else {
                throw new http_errors_1.NotFound('Post or user not found');
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post or user not found');
        }
    }
    async deleteComment(postId, commentId, req) {
        const user = await this.userService.findToken(req);
        const post = await this.postModel.findById({ _id: postId });
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (user.role === 'admin' || user.role === 'moderator') {
                const find = await this.postModel.findOneAndUpdate({ _id: postId }, { $pull: { comments: { id: commentId } } }, { new: true });
                return find;
            }
            else if (post.owner.id === user.id) {
                const find = await this.postModel.findOneAndUpdate({ _id: postId }, { $pull: { comments: { id: commentId } } }, { new: true });
                return find;
            }
            else {
                throw new http_errors_1.NotFound('Comment or user not found');
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Comment or user not found');
        }
    }
    async deleteExchange(postId, exchangeId, req) {
        const user = await this.userService.findToken(req);
        const post = await this.postModel.findById({ _id: postId });
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        const ownerId = user.id;
        const toExchangeArray = post.toExchange;
        const foundUser = function findInToExchange(toExchangeArray, ownerId) {
            const foundItem = toExchangeArray.find((item) => item.user === ownerId);
            return foundItem ? foundItem.data : null;
        };
        if (foundUser(toExchangeArray, ownerId) === null) {
            throw new http_errors_1.NotFound('Exchange not found');
        }
        try {
            if (user.role === 'admin' || user.role === 'moderator') {
                const find = await this.postModel.findOneAndUpdate({ _id: postId }, { $pull: { toExchange: { id: exchangeId } } }, { new: true });
                return find;
            }
            else if (post.owner.id === user.id) {
                const find = await this.postModel.findOneAndUpdate({ _id: postId }, { $pull: { toExchange: { id: exchangeId } } }, { new: true });
                return find;
            }
            else if (foundUser(toExchangeArray, ownerId).user === user.id) {
                const find = await this.postModel.findOneAndUpdate({ _id: postId }, { $pull: { toExchange: { id: exchangeId } } }, { new: true });
                return find;
            }
            else {
                throw new http_errors_1.NotFound('Exchange not found');
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Exchange not found');
        }
    }
    async verifyPost(id, req, postUp) {
        const admin = await this.userService.findToken(req);
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
        const user = await this.userService.findToken(req);
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
    async favoritePost(id, req) {
        const user = await this.userService.findToken(req);
        const post = await this.postModel.findById(id);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (!user || !post) {
                throw new http_errors_1.Conflict('Not found');
            }
            if (user && post) {
                const array = post.favorite;
                const index = array.indexOf(user.id);
                if (index > -1) {
                    array.splice(index, 1);
                }
                else {
                    array.push(user.id);
                }
                await this.postModel.updateOne({ _id: id }, { $set: { favorite: array } });
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
    async viewPost(id) {
        try {
            const post = await this.postModel.findById(id);
            if (!post) {
                throw new http_errors_1.Conflict('Not found');
            }
            if (post) {
                post.views += 1;
                post.save();
                return await this.postModel.findById(id);
            }
            else {
                return await this.postModel.findById(id);
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async findMyFavPosts(req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const post = await this.postModel.find({ favorite: user.id }).exec();
            return post;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async commentPosts(postId, req, comments) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const post = await this.postModel.findById(postId);
            if (post) {
                const { id, firstName, lastName, phone, avatarURL, location } = user;
                comments.user = {
                    id,
                    firstName,
                    lastName,
                    phone,
                    avatarURL,
                    location,
                };
                comments.id = (0, uuid_1.v4)();
                comments.answer = [];
                const array = post.comments;
                array.push(comments);
                await this.postModel.updateOne({ _id: postId }, { $set: { comments: array } });
                return await this.postModel.findById(postId);
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async answerCommentPosts(postId, req, commentId, answer) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const post = await this.postModel.findById(postId);
            if (post) {
                const comments = post.comments;
                const commentIndex = comments.findIndex((comment) => comment.id === commentId);
                if (commentIndex !== -1) {
                    const answerArr = comments[commentIndex].answer;
                    answer.id = (0, uuid_1.v4)();
                    const { id, firstName, lastName, phone, avatarURL, location } = user;
                    answer.user = { id, firstName, lastName, phone, avatarURL, location };
                    answerArr.push(answer);
                    await this.postModel.updateOne({ _id: postId, 'comments.id': commentId }, { $push: { 'comments.$.answer': answer } });
                    return await this.postModel.findById(postId);
                }
            }
            throw new http_errors_1.NotFound('Comment not found');
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async toExchangePosts(postId, userPostId, req) {
        try {
            const user = await this.userService.findToken(req);
            if (!user) {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            const post = await this.postModel.findById(postId);
            if (!post) {
                throw new http_errors_1.NotFound('Post not found');
            }
            const foundUser = function findInToExchange(toExchangeArray, ownerId) {
                const foundItem = toExchangeArray.find((item) => item.user === ownerId);
                return foundItem ? foundItem.user : null;
            };
            const userPost = await this.postModel.findById(userPostId);
            if (post) {
                if (foundUser(post.toExchange, user.id) === null) {
                    const array = post.toExchange;
                    array.push({
                        agree: null,
                        data: userPost,
                        user: {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            phone: user.phone,
                            avatarURL: user.avatarURL,
                            location: user.location,
                        },
                    });
                    await this.postModel.updateOne({ _id: postId }, { $set: { toExchange: array } });
                    const newPost = await this.postModel.findById(postId);
                    return newPost;
                }
                else {
                    throw new http_errors_1.NotFound('Offer already exist');
                }
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async exchangeTruePosts(postId, userPostId, req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const updatedPost = await this.postModel.updateOne({ _id: postId, 'toExchange.id': userPostId }, { $set: { 'toExchange.$.agree': true } });
            if (updatedPost.nModified === 0) {
                throw new http_errors_1.NotFound('Post or exchange item not found');
            }
            const updatedPostData = await this.postModel.findById(postId);
            return updatedPostData;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async exchangeFalsePosts(postId, userPostId, req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const updatedPost = await this.postModel.updateOne({ _id: postId, 'toExchange.id': userPostId }, { $set: { 'toExchange.$.agree': false } });
            if (updatedPost.nModified === 0) {
                throw new http_errors_1.NotFound('Post or exchange item not found');
            }
            const updatedPostData = await this.postModel.findById(postId);
            return updatedPostData;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async findMyOwnPosts(req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const post = await this.postModel
                .find({ 'toExchange.data.owner.id': user.id })
                .exec();
            return post;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
};
PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(posts_model_1.Posts.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [posts_model_1.Posts,
        users_model_1.User,
        users_service_1.UsersService])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map