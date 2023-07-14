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
exports.SendGridService = void 0;
const common_1 = require("@nestjs/common");
const mail_1 = require("@sendgrid/mail");
let SendGridService = class SendGridService {
    constructor(mailService) {
        this.mailService = mailService;
        this.mailService.setApiKey(process.env.SENDGRID_API_KEY);
    }
    async sendVerificationEmail(email, verificationLink) {
        const message = {
            to: email,
            from: 'lusiy321@gmail.com',
            subject: 'Email Verification from Thing',
            html: `<p>Click the link below to verify your email:</p><p><a href="${verificationLink}">Click</a></p>`,
        };
        await this.mailService.send(message);
    }
};
SendGridService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mail_1.MailService])
], SendGridService);
exports.SendGridService = SendGridService;
//# sourceMappingURL=sendgrid.service.js.map