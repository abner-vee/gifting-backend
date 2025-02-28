import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailMessage } from '../../common/types/cache-manager-redis-yet';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendEmail = async (message: IMailMessage) => {
    try {
      await this.mailerService.sendMail({
        to: message.receiverEmail,
        subject: message.subject,
        template: message.templateName,
        context: message.placeHolderData,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
}
