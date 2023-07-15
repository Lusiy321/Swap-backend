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
exports.CreateCommentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateCommentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64aee11adad509ad58f4f37d', description: 'User ID' }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Petro', description: 'User first name' }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Poroshenko', description: 'User last name' }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Change my item for your item',
        description: 'Comment description',
    }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "text", void 0);
exports.CreateCommentDto = CreateCommentDto;
//# sourceMappingURL=create.comment.dto.js.map