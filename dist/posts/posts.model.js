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
exports.PostSchema = exports.Posts = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
const update_user_dto_1 = require("../users/dto/update.user.dto");
const verify_post_dto_1 = require("./dto/verify.post.dto");
let Posts = class Posts extends mongoose_2.Model {
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My first post', description: 'Post title' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 50,
        required: [true, 'Title is required'],
    }),
    __metadata("design:type", String)
], Posts.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Change my item for your item',
        description: 'Post description',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 280,
        required: [true, 'Description is required'],
    }),
    __metadata("design:type", String)
], Posts.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electronics', description: 'Post category' }),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Posts.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://ldsound.info/wp-content/uploads/2013/07/25%D0%B0%D1%81128-ldsound_ru-1.jpg',
        description: 'Post image',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        default: 'https://ldsound.info/wp-content/uploads/2013/07/25%D0%B0%D1%81128-ldsound_ru-1.jpg',
    }),
    __metadata("design:type", String)
], Posts.prototype, "img", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '649b2cc373ebdf1b04d734ff',
        description: 'Post favorite',
    }),
    (0, mongoose_1.Prop)({
        type: Array,
        default: [],
    }),
    __metadata("design:type", Array)
], Posts.prototype, "favorite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: '6470ad832cfa126519500989',
            email: 'inga@mail.com',
            phone: '+38000000000',
        },
        description: 'Post owner',
    }),
    (0, mongoose_1.Prop)({
        type: Object,
    }),
    __metadata("design:type", update_user_dto_1.UpdateUserDto)
], Posts.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '100',
        description: 'Item price',
    }),
    (0, mongoose_1.Prop)({
        type: Number,
        default: '0',
    }),
    __metadata("design:type", Number)
], Posts.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'Post status' }),
    (0, mongoose_1.Prop)({
        enum: ['new', 'aprove', 'rejected'],
        default: 'new',
    }),
    __metadata("design:type", String)
], Posts.prototype, "verify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '200',
        description: 'Item price',
    }),
    (0, mongoose_1.Prop)({
        type: Number,
        default: '0',
    }),
    __metadata("design:type", Number)
], Posts.prototype, "views", void 0);
Posts = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], Posts);
exports.Posts = Posts;
exports.PostSchema = mongoose_1.SchemaFactory.createForClass(Posts);
//# sourceMappingURL=posts.model.js.map