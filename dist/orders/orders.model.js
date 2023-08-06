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
exports.OrderSchema = exports.Orders = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
const posts_model_1 = require("../posts/posts.model");
let Orders = class Orders extends mongoose_2.Model {
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
], Orders.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '649aa533a4fc5710d7ceaaAA',
        description: 'Offer for exchange',
    }),
    (0, mongoose_1.Prop)({
        type: posts_model_1.Posts,
    }),
    __metadata("design:type", posts_model_1.Posts)
], Orders.prototype, "offer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'order status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: null,
    }),
    __metadata("design:type", Boolean)
], Orders.prototype, "status", void 0);
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
], Orders.prototype, "chat", void 0);
Orders = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], Orders);
exports.Orders = Orders;
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Orders);
//# sourceMappingURL=orders.model.js.map