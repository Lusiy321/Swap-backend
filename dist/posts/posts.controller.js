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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const posts_service_1 = require("./posts.service");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_post_dto_1 = require("./dto/create.post.dto");
const posts_model_1 = require("./posts.model");
const verify_post_dto_1 = require("./dto/verify.post.dto");
const create_comment_dto_1 = require("./dto/create.comment.dto");
const category_post_dto_1 = require("./dto/category.post.dto");
let PostsController = class PostsController {
    constructor(postService) {
        this.postService = postService;
    }
    async create(post, request) {
        return this.postService.createPost(post, request);
    }
    async findAll(request) {
        return this.postService.findAllPosts(request);
    }
    async findNew(request) {
        return this.postService.findNewPosts(request);
    }
    async findMy(request) {
        return this.postService.findMyPosts(request);
    }
    async findUserPost(id) {
        return this.postService.findUserPosts(id);
    }
    async findAllAprove() {
        return this.postService.findAllApprovedPosts();
    }
    async searchPosts(query) {
        return this.postService.searchPosts(query);
    }
    async findById(id) {
        return this.postService.findPostById(id);
    }
    async update(post, request, id) {
        return this.postService.updatePost(post, id, request);
    }
    async delete(id, request) {
        return this.postService.deletePost(id, request);
    }
    async setVerify(post, id, request) {
        return this.postService.verifyPost(id, request, post);
    }
    async setActive(id, request) {
        return this.postService.activePost(id, request);
    }
    async setFavorite(id, request) {
        return this.postService.favoritePost(id, request);
    }
    async setMyFavorite(request) {
        return this.postService.findMyFavPosts(request);
    }
    async getMyExchenge(request) {
        return this.postService.findMyOwnPosts(request);
    }
    async setViews(id, request) {
        return this.postService.viewPost(id, request);
    }
    async setComments(comments, id, request) {
        return this.postService.commentPosts(id, request, comments);
    }
    async deleteComment(postId, commentId, request) {
        return this.postService.deleteComment(postId, commentId, request);
    }
    async setAnswerComments(answer, postId, commentId, request) {
        return this.postService.answerCommentPosts(postId, request, commentId, answer);
    }
    async setExchange(postId, userPostId, request) {
        return this.postService.toExchangePosts(postId, userPostId, request);
    }
    async deleteExchange(postId, exchangeId, request) {
        return this.postService.deleteExchange(postId, exchangeId, request);
    }
    async setExchangeTrue(postId, userPostId, request) {
        return this.postService.exchangeTruePosts(postId, userPostId, request);
    }
    async setExchangeFalse(postId, userPostId, request) {
        return this.postService.exchangeFalsePosts(postId, userPostId, request);
    }
    async setCategory(category, id, request) {
        return this.postService.setCategoryPosts(id, request, category);
    }
    async getCat() {
        return this.postService.getCategory();
    }
    async findCategory(request) {
        return this.postService.findByCategory(request);
    }
    async addCategory(category, request) {
        return this.postService.addCategory(category, request);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all Post (admin of moderator only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [posts_model_1.Posts] }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Get)('/all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get new Post (admin of moderator only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [posts_model_1.Posts] }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Get)('/new'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findNew", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get my Posts' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [posts_model_1.Posts] }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Get)('/my'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findMy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get user Posts' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [posts_model_1.Posts] }),
    (0, common_1.Get)('/user-posts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findUserPost", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all approved Post if post active' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [posts_model_1.Posts] }),
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findAllAprove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Search posts from query ( ?req= )' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [posts_model_1.Posts] }),
    (0, common_1.Get)('/search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "searchPosts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get post by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, common_1.Get)('/find/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object, String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delet post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Verify user enum: [new, aprove, rejected] (admin of moderator only)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('/verify/:Id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('Id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_post_dto_1.VerifyPostDto, String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setVerify", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Post status (active of not active) (This user only)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('/active/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setActive", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Favorite post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('/fav/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setFavorite", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get my favorite post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Get)('/myfav'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setMyFavorite", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get my exchanges' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Get)('/my-exchange'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getMyExchenge", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Post views' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('/view/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setViews", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Set comments',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('/comments/:Id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('Id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto, String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setComments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delet comments' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('/comments/:postId/:commentId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deleteComment", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Set comment for comments',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('/comments/:postId/:commentId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Param)('commentId')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setAnswerComments", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Set propouse for exchange',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('/to-exchange/:postId/:userPostId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Param)('userPostId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setExchange", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delet exchanges' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('/to-exchange/:postId/:exchangeId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Param)('exchangeId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deleteExchange", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Set propouse for exchange',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('/to-exchange-true/:postId/:userPostId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Param)('userPostId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setExchangeTrue", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Set propouse for exchange',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('/to-exchange-false/:postId/:userPostId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Param)('userPostId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setExchangeFalse", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Set category',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('/category/:Id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('Id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_post_dto_1.CategoryPostDto, String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get category',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: String }),
    (0, common_1.Get)('/category'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getCat", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find by category',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, common_1.Get)('/category/sort/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Add category',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('/category/add/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "addCategory", null);
PostsController = __decorate([
    (0, swagger_1.ApiTags)('Post'),
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
exports.PostsController = PostsController;
//# sourceMappingURL=posts.controller.js.map