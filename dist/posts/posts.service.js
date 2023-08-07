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
const users_service_1 = require("../users/users.service");
const uuid_1 = require("uuid");
const orders_service_1 = require("../orders/orders.service");
const orders_model_1 = require("../orders/orders.model");
let PostsService = class PostsService {
    constructor(postModel, orderModel, userService, orderService) {
        this.postModel = postModel;
        this.orderModel = orderModel;
        this.userService = userService;
        this.orderService = orderService;
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
        const { req } = query;
        try {
            const searchItem = req;
            const regex = new RegExp(searchItem, 'i');
            const find = await this.postModel
                .find({ title: { $regex: regex } })
                .exec();
            if (Array.isArray(find) && find.length === 0) {
                const descr = await this.postModel
                    .find({ description: { $regex: regex } })
                    .exec();
                if (Array.isArray(descr) && descr.length === 0) {
                    return await this.postModel.find();
                }
                return descr;
            }
            else {
                return find;
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
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
            throw new http_errors_1.NotFound('Post Not found');
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
                this.updatePostData(id);
                return this.postModel.findById({ _id: id });
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async updatePostData(findId) {
        const post = await this.postModel.findById({ _id: findId });
        await this.postModel.updateMany({ 'toExchange.data.id': post.id }, {
            $set: {
                'toExchange.$[toExchange].data': {
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    img: post.img,
                    price: post.price,
                },
            },
        }, { arrayFilters: [{ 'toExchange.data.id': post.id }] });
        await this.orderModel.updateMany({ product: { _id: post.id } }, {
            $set: {
                product: post,
            },
        });
        await this.orderModel.updateMany({ offer: { _id: post.id } }, {
            $set: {
                offer: post,
            },
        });
        return;
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
        const commentArr = post.comments;
        const foundUser = function findInToExchange(commentArr, ownerId) {
            const foundItem = commentArr.find((item) => item.user.id === ownerId);
            return foundItem ? foundItem.user.id : null;
        };
        try {
            if (user.role === 'admin' || user.role === 'moderator') {
                const find = await this.postModel.findOneAndUpdate({ _id: postId }, { $pull: { comments: { id: commentId } } }, { new: true });
                return find;
            }
            else if (foundUser(commentArr, user.id) === user.id) {
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
            const foundItem = toExchangeArray.find((item) => item.user.id === ownerId);
            return foundItem ? foundItem.user.id : null;
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
            else if (foundUser(toExchangeArray, ownerId) === user.id) {
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
    async viewPost(id, req) {
        const post = await this.postModel.findById(id);
        const user = await this.userService.findToken(req);
        if (!post) {
            throw new http_errors_1.Conflict('Not found');
        }
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (post) {
                if (post.owner.id === user.id) {
                    return await this.postModel.findById(id);
                }
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
                await this.postModel.updateOne({ _id: postId }, { $set: { chat: array } });
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
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        const post = await this.postModel.findById(postId);
        if (!post) {
            throw new http_errors_1.NotFound('Post not found');
        }
        const userPost = await this.postModel.findById(userPostId);
        if (!userPost) {
            throw new http_errors_1.NotFound('Post not found');
        }
        const foundUser = function findInToExchange(toExchangeArray, ownerId) {
            const foundItem = toExchangeArray.find((item) => item.data.id === ownerId);
            return foundItem ? foundItem.data.id : null;
        };
        const orderProduct = await this.orderModel.findOne({
            $and: [
                { 'product._id': { $eq: postId } },
                { 'offer._id': { $eq: userPostId } },
            ],
        });
        const orderOffer = await this.orderModel.findOne({
            $and: [
                { 'product._id': { $eq: userPostId } },
                { 'offer._id': { $eq: postId } },
            ],
        });
        if (userPost.verify === 'approve') {
            if (foundUser(post.toExchange, userPost.id) === null &&
                orderProduct === null &&
                orderOffer === null) {
                const exchId = (0, uuid_1.v4)();
                const array = post.toExchange;
                array.push({
                    id: exchId,
                    agree: null,
                    data: {
                        id: userPost.id,
                        title: userPost.title,
                        description: userPost.description,
                        img: userPost.img,
                        price: userPost.price,
                    },
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
    async exchangeTruePosts(postId, userPostId, req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        const order = await this.orderModel.findOne({
            $and: [
                { 'product._id': { $eq: postId } },
                { 'offer._id': { $eq: userPostId } },
            ],
        });
        try {
            if (order === null) {
                await this.orderService.createOrder(postId, userPostId);
                const updatedPost = await this.postModel.updateOne({ _id: postId, 'toExchange.data.id': userPostId }, { $pull: { toExchange: { 'data.id': userPostId } } }, { new: true });
                if (updatedPost.nModified === 0) {
                    throw new http_errors_1.NotFound('Post or exchange item not found');
                }
            }
            else {
                return (0, http_errors_1.NotFound)('Post exist');
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
            const updatedPost = await this.postModel.updateOne({ _id: postId, 'toExchange.data.id': userPostId }, { $pull: { toExchange: { 'data.id': userPostId } } }, { new: true });
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
                .find({ 'toExchange.user.id': user.id })
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
    __param(1, (0, mongoose_1.InjectModel)(orders_model_1.Orders.name)),
    __metadata("design:paramtypes", [posts_model_1.Posts,
        orders_model_1.Orders,
        users_service_1.UsersService,
        orders_service_1.OrderService])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map