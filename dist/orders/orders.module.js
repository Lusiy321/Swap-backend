"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const orders_controller_1 = require("./orders.controller");
const orders_model_1 = require("./orders.model");
const mongoose_1 = require("@nestjs/mongoose");
const orders_service_1 = require("./orders.service");
const users_model_1 = require("../users/users.model");
const posts_model_1 = require("../posts/posts.model");
const users_module_1 = require("../users/users.module");
const users_service_1 = require("../users/users.service");
const orders_arhive_model_1 = require("./orders-arhive.model");
let OrdersModule = class OrdersModule {
};
OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            mongoose_1.MongooseModule.forFeature([
                { name: orders_model_1.Orders.name, schema: orders_model_1.OrderSchema, collection: 'orders' },
            ]),
            mongoose_1.MongooseModule.forFeature([
                {
                    name: orders_arhive_model_1.OrdersArhive.name,
                    schema: orders_arhive_model_1.OrdersArhiveSchema,
                    collection: 'orders-arhive',
                },
            ]),
            mongoose_1.MongooseModule.forFeature([
                { name: users_model_1.User.name, schema: users_model_1.UserSchema, collection: 'users' },
            ]),
            mongoose_1.MongooseModule.forFeature([
                { name: posts_model_1.Posts.name, schema: posts_model_1.PostSchema, collection: 'posts' },
            ]),
        ],
        exports: [orders_service_1.OrderService],
        controllers: [orders_controller_1.OrdersController],
        providers: [orders_service_1.OrderService, users_service_1.UsersService],
    })
], OrdersModule);
exports.OrdersModule = OrdersModule;
//# sourceMappingURL=orders.module.js.map