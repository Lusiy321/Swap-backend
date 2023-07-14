/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor(private readonly mailService: MailService) {
    this.mailService.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string,
  ): Promise<void> {
    const message = {
      to: email,
      from: 'lusiy321@gmail.com',
      subject: 'Email Verification from Thing',
      html: `<p>Click the link below to verify your email:</p><p><a href="${verificationLink}">Click</a></p>`,
    };

    await this.mailService.send(message);
  }
}
