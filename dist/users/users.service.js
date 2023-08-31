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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_model_1 = require("./users.model");
const bcrypt_1 = require("bcrypt");
const http_errors_1 = require("http-errors");
const jsonwebtoken_1 = require("jsonwebtoken");
const posts_model_1 = require("../posts/posts.model");
const orders_model_1 = require("../orders/orders.model");
const sgMail = require("@sendgrid/mail");
const message_variables_1 = require("./utils/message-variables");
let UsersService = class UsersService {
    constructor(userModel, postModel, orderModel) {
        this.userModel = userModel;
        this.postModel = postModel;
        this.orderModel = orderModel;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
    async findById(id) {
        try {
            const find = await this.userModel.findById(id).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async create(user) {
        try {
            const { email } = user;
            const lowerCaseEmail = email.toLowerCase();
            const registrationUser = await this.userModel.findOne({
                email: lowerCaseEmail,
            });
            if (registrationUser) {
                throw new http_errors_1.Conflict(`User with ${email} in use`);
            }
            const createdUser = await this.userModel.create(user);
            createdUser.setName(lowerCaseEmail);
            createdUser.setPassword(user.password);
            createdUser.save();
            const verificationLink = `https://swap-server.cyclic.cloud/auth/verify-email/${createdUser._id}`;
            await this.sendVerificationEmail(email, verificationLink);
            return await this.userModel.findById(createdUser._id);
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async sendVerificationEmail(email, verificationLink) {
        const msg = {
            to: email,
            from: 'lusiy321@gmail.com',
            subject: 'Email Verification from Swep',
            html: `<p>Click the link below to verify your email:</p><p><a href="${verificationLink}">Click</a></p>`,
        };
        try {
            await sgMail.send(msg);
        }
        catch (error) {
            throw new Error('Failed to send verification email');
        }
    }
    async verifyUserEmail(id) {
        try {
            const user = await this.userModel.findById(id);
            user.verify = true;
            user.save();
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async changePassword(req, newPass) {
        const user = await this.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const { oldPassword, password } = newPass;
            if (user.comparePassword(oldPassword) === true) {
                user.setPassword(password);
                user.save();
                const msg = {
                    to: user.email,
                    from: 'lusiy321@gmail.com',
                    subject: 'Your password has been changed on swep.com',
                    html: message_variables_1.changePasswordMsg,
                };
                await sgMail.send(msg);
                return await this.userModel.findById(user._id);
            }
            throw new http_errors_1.BadRequest('Password is not avaible');
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async restorePassword(email) {
        const restoreMail = await this.userModel.findOne(email);
        try {
            if (restoreMail) {
                const msg = {
                    to: restoreMail.email,
                    from: 'lusiy321@gmail.com',
                    subject: 'Change your password on swep.com',
                    html: message_variables_1.restorePasswordMsg,
                };
                return await sgMail.send(msg);
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest('User not found');
        }
    }
    async updateRestorePassword(id, newPass) {
        const user = await this.userModel.findById(id);
        const { password } = newPass;
        try {
            if (user) {
                user.setPassword(password);
                user.save();
                const msg = {
                    to: user.email,
                    from: 'lusiy321@gmail.com',
                    subject: 'Your password has been changed on swep.com',
                    html: message_variables_1.changePasswordMsg,
                };
                await sgMail.send(msg);
                return await this.userModel.findById(user._id);
            }
            throw new http_errors_1.BadRequest('User not found');
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async login(user) {
        try {
            const { email, password } = user;
            const lowerCaseEmail = email.toLowerCase();
            const authUser = await this.userModel.findOne({ email: lowerCaseEmail });
            if (!authUser || !authUser.comparePassword(password)) {
                throw new http_errors_1.Unauthorized(`Email or password is wrong`);
            }
            return this.createToken(authUser);
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async logout(req) {
        const user = await this.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            await this.userModel.findByIdAndUpdate({ _id: user.id }, { token: null });
            return await this.userModel.findById({ _id: user.id });
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async update(user, req) {
        const { firstName, lastName, phone, location, avatarURL } = user;
        const findId = await this.findToken(req);
        if (!findId) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        if (firstName || lastName || phone || location || avatarURL) {
            await this.userModel.findByIdAndUpdate({ _id: findId.id }, { firstName, lastName, phone, location, avatarURL });
            const userUpdate = this.userModel.findById({ _id: findId.id });
            this.updateUserData(findId.id);
            return userUpdate;
        }
    }
    async updateUserData(findId) {
        const user = await this.userModel.findById({ _id: findId });
        await this.postModel.updateMany({ 'owner.id': user.id }, {
            $set: {
                owner: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    avatarURL: user.avatarURL,
                    location: user.location,
                },
            },
        });
        await this.postModel.updateMany({ 'comments.user.id': user.id }, {
            $set: {
                'comments.$[comment].user': {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    avatarURL: user.avatarURL,
                    location: user.location,
                },
            },
        }, { arrayFilters: [{ 'comment.user.id': user.id }] });
        await this.postModel.updateMany({ 'toExchange.user.id': user.id }, {
            $set: {
                'toExchange.$[toExchange].user': {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    avatarURL: user.avatarURL,
                    location: user.location,
                },
            },
        }, { arrayFilters: [{ 'toExchange.user.id': user.id }] });
        await this.postModel.updateMany({ 'comments.answer.user.id': user.id }, {
            $set: {
                'comments.$[comment].answer.$[ans].user': {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    avatarURL: user.avatarURL,
                    location: user.location,
                },
            },
        }, {
            arrayFilters: [
                { 'comment.user.id': user.id },
                { 'ans.user.id': user.id },
            ],
        });
        await this.orderModel.updateMany({ 'product.owner.id': user.id }, {
            $set: {
                owner: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    avatarURL: user.avatarURL,
                    location: user.location,
                },
            },
        });
        await this.orderModel.updateMany({ 'offer.owner.id': user.id }, {
            $set: {
                owner: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    avatarURL: user.avatarURL,
                    location: user.location,
                },
            },
        });
        return;
    }
    async findOrCreateUser(googleId, firstName, email) {
        try {
            let user = await this.userModel.findOne({ googleId });
            if (!user) {
                user = await this.userModel.create({
                    googleId,
                    firstName,
                    email,
                });
                user.setPassword(googleId);
                return user.save();
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async findToken(req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const user = await this.userModel.findById({ _id: findId.id });
            return user;
        }
        catch (e) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
    }
    async createToken(authUser) {
        const payload = {
            id: authUser._id,
        };
        const SECRET_KEY = process.env.SECRET_KEY;
        const token = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '1m' });
        await this.userModel.findByIdAndUpdate(authUser._id, { token });
        const authentificationUser = await this.userModel.findById({
            _id: authUser._id,
        });
        return authentificationUser;
    }
    async refreshAccessToken(req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const user = await this.userModel.findOne({ token: token });
            if (!user) {
                throw new http_errors_1.NotFound('User not found');
            }
            const payload = {
                id: user._id,
            };
            const tokenRef = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '24h' });
            await this.userModel.findByIdAndUpdate(user._id, { token: tokenRef });
            const authentificationUser = await this.userModel.findById({
                _id: user.id,
            });
            return authentificationUser;
        }
        catch (error) {
            throw new http_errors_1.BadRequest('Invalid refresh token');
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(posts_model_1.Posts.name)),
    __param(2, (0, mongoose_1.InjectModel)(orders_model_1.Orders.name)),
    __metadata("design:paramtypes", [users_model_1.User,
        posts_model_1.Posts,
        orders_model_1.Orders])
], UsersService);
exports.UsersService = UsersService;
users_model_1.UserSchema.methods.setPassword = async function (password) {
    return (this.password = (0, bcrypt_1.hashSync)(password, 10));
};
users_model_1.UserSchema.methods.setName = function (email) {
    const parts = email.split('@');
    this.firstName = parts[0];
};
users_model_1.UserSchema.methods.comparePassword = function (password) {
    return (0, bcrypt_1.compareSync)(password, this.password);
};
//# sourceMappingURL=users.service.js.map