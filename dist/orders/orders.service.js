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
const users_model_1 = require("../users/users.model");
const http_errors_1 = require("http-errors");
let OrderService = class OrderService {
    constructor(orderModel, userModel, postModel) {
        this.orderModel = orderModel;
        this.userModel = userModel;
        this.postModel = postModel;
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
};
OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(orders_model_1.Orders.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(posts_model_1.Posts.name)),
    __metadata("design:paramtypes", [orders_model_1.Orders,
        users_model_1.User,
        posts_model_1.Posts])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=orders.service.js.map