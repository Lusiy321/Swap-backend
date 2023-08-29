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
exports.CategoryPostDto = exports.categoryList = void 0;
const swagger_1 = require("@nestjs/swagger");
var categoryList;
(function (categoryList) {
    categoryList["other"] = "other";
    categoryList["cloth"] = "cloth";
    categoryList["electronics"] = "electronics";
    categoryList["health"] = "health";
    categoryList["house"] = "house";
    categoryList["sport"] = "sport";
    categoryList["children"] = "children";
    categoryList["animals"] = "animals";
    categoryList["books"] = "books";
    categoryList["auto"] = "auto";
    categoryList["food"] = "food";
    categoryList["craft"] = "craft";
    categoryList["souvenirs"] = "souvenirs";
    categoryList["garden"] = "garden";
    categoryList["collecting"] = "collecting";
})(categoryList = exports.categoryList || (exports.categoryList = {}));
class CategoryPostDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'electronics',
        description: 'Post category',
    }),
    __metadata("design:type", String)
], CategoryPostDto.prototype, "category", void 0);
exports.CategoryPostDto = CategoryPostDto;
//# sourceMappingURL=category.post.dto.js.map