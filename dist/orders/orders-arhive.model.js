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
exports.OrdersArhiveSchema = exports.OrdersArhive = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
const posts_model_1 = require("../posts/posts.model");
let OrdersArhive = class OrdersArhive extends mongoose_2.Model {
};
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '649aa533a4fc5710d7ceaac3',
        description: 'Item for exchange',
    }),
    (0, mongoose_1.Prop)({
        type: posts_model_1.Posts,
    }),
    __metadata("design:type", posts_model_1.Posts)
], OrdersArhive.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '649aa533a4fc5710d7ceaaAA',
        description: 'Offer for exchange',
    }),
    (0, mongoose_1.Prop)({
        type: posts_model_1.Posts,
    }),
    __metadata("design:type", posts_model_1.Posts)
], OrdersArhive.prototype, "offer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'order status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: null,
    }),
    __metadata("design:type", Boolean)
], OrdersArhive.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: String,
            text: { type: String, required: true },
            user: {
                id: String,
                firstName: String,
                lastName: String,
                phone: String,
                avatarURL: String,
                location: String,
            },
        },
        description: 'Order chat',
    }),
    (0, mongoose_1.Prop)({
        type: [
            {
                id: String,
                text: { type: String, required: true },
                user: {
                    id: String,
                    firstName: String,
                    lastName: String,
                    phone: String,
                    avatarURL: String,
                    location: String,
                },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], OrdersArhive.prototype, "chat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'Product order status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: null,
    }),
    __metadata("design:type", Boolean)
], OrdersArhive.prototype, "productStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'Offer order status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: null,
    }),
    __metadata("design:type", Boolean)
], OrdersArhive.prototype, "offerStatus", void 0);
OrdersArhive = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], OrdersArhive);
exports.OrdersArhive = OrdersArhive;
exports.OrdersArhiveSchema = mongoose_1.SchemaFactory.createForClass(OrdersArhive);
//# sourceMappingURL=orders-arhive.model.js.map