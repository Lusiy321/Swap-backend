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
const verify_post_dto_1 = require("./dto/verify.post.dto");
const category_post_dto_1 = require("./dto/category.post.dto");
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
    (0, mongoose_1.Prop)({ enum: ['other', 'electronics', 'cloth'], default: 'other' }),
    __metadata("design:type", String)
], Posts.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Kyiv',
        description: 'Item location',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 20,
        default: 'Kyiv',
    }),
    __metadata("design:type", String)
], Posts.prototype, "location", void 0);
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
            id: '649aa533a4fc5710d7ceaac3',
            firstName: 'Poroshok',
            lastName: 'Poroh',
            phone: '+380984561225',
            avatarURL: 'https://res.cloudinary.com/dvt0czglz/image/upload/v1688504857/lsrcstjlmitwcrhhdjon.jpg',
            location: 'Jitomir',
        },
        description: 'Post owner',
    }),
    (0, mongoose_1.Prop)({
        type: Object,
    }),
    __metadata("design:type", Object)
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
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'Post moderate status' }),
    (0, mongoose_1.Prop)({
        enum: ['new', 'approve', 'rejected'],
        default: 'new',
    }),
    __metadata("design:type", String)
], Posts.prototype, "verify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'Post status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: true,
    }),
    __metadata("design:type", Boolean)
], Posts.prototype, "isActive", void 0);
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
__decorate([
    (0, swagger_1.ApiProperty)({ example: '[]', description: 'Post comments' }),
    (0, mongoose_1.Prop)({
        type: [
            {
                id: String,
                text: { type: String, required: true, minlength: 2 },
                user: {
                    id: { type: String },
                    firstName: String,
                    lastName: String,
                    phone: String,
                    avatarURL: String,
                    location: String,
                },
                answer: [
                    {
                        id: String,
                        text: { type: String, required: true, minlength: 2 },
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
            },
            { _id: false },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Posts.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '[]', description: 'Post to exchange' }),
    (0, mongoose_1.Prop)({
        type: [
            {
                id: String,
                agree: { type: Boolean, required: null },
                data: Object,
                user: {
                    id: { type: String },
                    firstName: String,
                    lastName: String,
                    phone: String,
                    avatarURL: String,
                    location: String,
                },
            },
            { _id: false },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Posts.prototype, "toExchange", void 0);
Posts = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], Posts);
exports.Posts = Posts;
exports.PostSchema = mongoose_1.SchemaFactory.createForClass(Posts);
//# sourceMappingURL=posts.model.js.map