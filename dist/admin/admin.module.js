"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const posts_model_1 = require("../posts/posts.model");
const users_model_1 = require("../users/users.model");
const orders_model_1 = require("../orders/orders.model");
const users_module_1 = require("../users/users.module");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const mongoose_1 = require("@nestjs/mongoose");
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            mongoose_1.MongooseModule.forFeature([
                { name: posts_model_1.Posts.name, schema: posts_model_1.PostSchema, collection: 'posts' },
            ]),
            mongoose_1.MongooseModule.forFeature([
                { name: users_model_1.User.name, schema: users_model_1.UserSchema, collection: 'users' },
            ]),
            mongoose_1.MongooseModule.forFeature([
                { name: orders_model_1.Orders.name, schema: orders_model_1.OrderSchema, collection: 'orders' },
            ]),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map