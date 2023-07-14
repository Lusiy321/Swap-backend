/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { SendGridService } from './sendgrid.service';
import { MailService } from '@sendgrid/mail';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      },
    }),
  ],
  providers: [SendGridService, MailService],
  exports: [SendGridService],
})
export class SendGridModule {}
