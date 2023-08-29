"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const users_model_1 = require("./users/users.model");
const passport_1 = require("@nestjs/passport");
const posts_controller_1 = require("./posts/posts.controller");
const posts_service_1 = require("./posts/posts.service");
const posts_module_1 = require("./posts/posts.module");
const posts_model_1 = require("./posts/posts.model");
const auth_module_1 = require("./auth/auth.module");
const orders_service_1 = require("./orders/orders.service");
const orders_module_1 = require("./orders/orders.module");
const orders_model_1 = require("./orders/orders.model");
const users_service_1 = require("./users/users.service");
const orders_arhive_model_1 = require("./orders/orders-arhive.model");
const http_1 = require("http");
const chat_gateway_1 = require("./orders/utils/chat.gateway");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            config_1.ConfigModule.forRoot({
                envFilePath: `.env`,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.DB_HOST),
            mongoose_1.MongooseModule.forFeature([
                { name: orders_model_1.Orders.name, schema: orders_model_1.OrderSchema, collection: 'orders' },
            ]),
            mongoose_1.MongooseModule.forFeature([
                { name: users_model_1.User.name, schema: users_model_1.UserSchema, collection: 'users' },
            ]),
            mongoose_1.MongooseModule.forFeature([
                { name: posts_model_1.Posts.name, schema: posts_model_1.PostSchema, collection: 'posts' },
            ]),
            mongoose_1.MongooseModule.forFeature([
                {
                    name: orders_arhive_model_1.OrdersArhive.name,
                    schema: orders_arhive_model_1.OrdersArhiveSchema,
                    collection: 'orders-arhive',
                },
            ]),
            users_module_1.UsersModule,
            passport_1.PassportModule.register({ session: true }),
            posts_module_1.PostsModule,
            orders_module_1.OrdersModule,
            http_1.Server,
        ],
        controllers: [posts_controller_1.PostsController],
        providers: [posts_service_1.PostsService, orders_service_1.OrderService, users_service_1.UsersService, chat_gateway_1.ChatGateway],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map