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
let User = exports.User = class User extends mongoose_2.Model {
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Petro', description: 'User name' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 20,
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'poroshenko@gmail.com', description: 'User email' }),
    (0, mongoose_1.Prop)({ type: String, required: [true, 'Email is required'] }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Petro-123545', description: 'User password' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 6,
        required: [true, 'Password is required'],
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin', description: 'User role' }),
    (0, mongoose_1.Prop)({ required: true, enum: ['admin', 'boss', 'user'], default: 'user' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['64849dc0b92d9a89e4bbf568'],
        description: 'Subordinates users ID',
    }),
    (0, mongoose_1.Prop)({ type: [{ type: 'ObjectId', ref: 'User' }], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "boss", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'JWT token',
    }),
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], User.prototype, "token", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)()
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=users.model.js.map