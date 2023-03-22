import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService{
    constructor(private mailerService: MailerService,){}

    async sendEmail({toEmail, name}) {
        await this.mailerService.sendMail({
            to: toEmail,
            from: process.env.FROM_EMAIL,
            subject: 'WELCOME USER',
            template: './email',
            context: {
                name: name
            }
        }).then(resp => {
            console.log(resp)
        }).catch(err => {
            console.log(err)
        })
        
    }
}