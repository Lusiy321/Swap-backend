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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const orders_model_1 = require("./orders.model");
const mongoose_1 = require("@nestjs/mongoose");
const posts_model_1 = require("../posts/posts.model");
const uuid_1 = require("uuid");
const users_model_1 = require("../users/users.model");
const http_errors_1 = require("http-errors");
const users_service_1 = require("../users/users.service");
const orders_arhive_model_1 = require("./orders-arhive.model");
const mongoose_2 = require("mongoose");
let OrderService = class OrderService {
    constructor(orderModel, userModel, postModel, orderArchiveModel, userService) {
        this.orderModel = orderModel;
        this.userModel = userModel;
        this.postModel = postModel;
        this.orderArchiveModel = orderArchiveModel;
        this.userService = userService;
    }
    async createOrder(postId, userPostId) {
        try {
            const prod = await this.postModel.findById(postId);
            const offer = await this.postModel.findById(userPostId);
            if (!prod || !offer) {
                throw new http_errors_1.NotFound('Product or Offer not found');
            }
            const order = {
                product: prod,
                offer: offer,
            };
            const newOrder = await this.orderModel.create(order);
            return newOrder;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Product or Offer not found');
        }
    }
    async findMyOwnOrder(req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const postProduct = await this.orderModel
                .find({ 'product.owner.id': user.id })
                .exec();
            const postOffer = await this.orderModel
                .find({ 'offer.owner.id': user.id })
                .exec();
            postProduct.push(...postOffer);
            if (Array.isArray(postProduct) && postProduct.length === 0) {
                return new http_errors_1.NotFound('Post not found');
            }
            return postProduct;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async findOrderById(id) {
        try {
            const find = await this.orderModel.findById(id).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Order not found');
        }
    }
    async chatMessage(postId, req, message) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const post = await this.orderModel.findById(postId);
            if (post) {
                const { id, firstName, lastName, phone, avatarURL, location } = user;
                message.user = {
                    id,
                    firstName,
                    lastName,
                    phone,
                    avatarURL,
                    location,
                };
                message.id = (0, uuid_1.v4)();
                message.time = Date.now();
                const array = post.chat;
                array.push(message);
                await this.orderModel.updateOne({ _id: postId }, { $set: { chat: array } });
                return await this.orderModel.findById(postId);
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async approveOrderAndArhive(orderId, req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const order = await this.orderModel.findById(orderId).exec();
            if (order.product.owner.id === user.id) {
                order.productStatus = true;
                order.save();
            }
            else if (order.offer.owner.id === user.id) {
                order.offerStatus = true;
                order.save();
            }
            else {
                throw new http_errors_1.NotFound('User not found');
            }
            if (order.productStatus === true && order.offerStatus === true) {
                order.status = true;
                order.save();
                const archivedOrder = new this.orderArchiveModel(order.toObject());
                await archivedOrder.save();
                await this.orderModel.findByIdAndDelete(orderId);
                await this.postModel.findByIdAndDelete(order.product.id);
                await this.postModel.findByIdAndDelete(order.offer.id);
                const productUser = await this.userModel.findById(order.product.owner.id);
                productUser.deals += 1;
                productUser.save();
                const offerUser = await this.userModel.findById(order.offer.owner.id);
                offerUser.deals += 1;
                offerUser.save();
                return order;
            }
            return order;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Order not found');
        }
    }
    async rejectOrderAndArhive(orderId, req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const order = await this.orderModel.findById(orderId).exec();
            if (order.product.owner.id === user.id) {
                order.productStatus = false;
                order.status = false;
                order.save();
            }
            else if (order.offer.owner.id === user.id) {
                order.offerStatus = false;
                order.status = false;
                order.save();
            }
            else {
                throw new http_errors_1.NotFound('User not found');
            }
            if (order.productStatus === false && order.offerStatus === false) {
                const archivedOrder = new this.orderArchiveModel(order.toObject());
                await archivedOrder.save();
                await this.orderModel.findByIdAndDelete(orderId);
                return order;
            }
            return order;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Order not found');
        }
    }
    async findAllApproveOrders(req) {
        const user = await this.userService.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const userOffer = await this.orderArchiveModel
                .find({ 'offer.owner.id': user.id })
                .exec();
            const userProduct = await this.orderArchiveModel
                .find({ 'product.owner.id': user.id })
                .exec();
            const sumArr = [...userProduct, ...userOffer];
            if (Array.isArray(sumArr) && sumArr.length === 0) {
                throw new http_errors_1.NotFound('Order not found');
            }
            return sumArr;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Order not found');
        }
    }
};
OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(orders_model_1.Orders.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(posts_model_1.Posts.name)),
    __param(3, (0, mongoose_1.InjectModel)(orders_arhive_model_1.OrdersArhive.name)),
    __metadata("design:paramtypes", [orders_model_1.Orders,
        users_model_1.User,
        posts_model_1.Posts,
        mongoose_2.Model,
        users_service_1.UsersService])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=orders.service.js.map