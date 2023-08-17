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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
const role_user_dto_1 = require("./dto/role.user.dto");
let User = class User extends mongoose_2.Model {
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Petro', description: 'User first name' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 20,
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Poroshenko', description: 'User last name' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 20,
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'poroshenko@gmail.com', description: 'User email' }),
    (0, mongoose_1.Prop)({ type: String, required: [true, 'Email is required'] }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Petro-123545', description: 'User password' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 8,
        required: [true, 'Password is required'],
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380987894556',
        description: 'User phone number',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 10,
        maxlength: 13,
        default: '+380000000000',
    }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Kyiv',
        description: 'User location',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 20,
        default: 'Kyiv',
    }),
    __metadata("design:type", String)
], User.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://',
        description: 'User avatarURL',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    }),
    __metadata("design:type", String)
], User.prototype, "avatarURL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin', description: 'User role' }),
    (0, mongoose_1.Prop)({
        enum: ['admin', 'moderator', 'user'],
        default: 'user',
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isOnline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'JWT token',
    }),
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], User.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "verify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '200',
        description: 'Deals',
    }),
    (0, mongoose_1.Prop)({
        type: Number,
        default: '0',
    }),
    __metadata("design:type", Number)
], User.prototype, "deals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'jE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'Verification token',
    }),
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], User.prototype, "verificationToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'Google ID',
    }),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'false', description: 'User ban status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "ban", void 0);
User = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], User);
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=users.model.js.map