import { MailService } from '@sendgrid/mail';
export declare class SendGridService {
    private readonly mailService;
    constructor(mailService: MailService);
    sendVerificationEmail(email: string, verificationLink: string): Promise<void>;
}
