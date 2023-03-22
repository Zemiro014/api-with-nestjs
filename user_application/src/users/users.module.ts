import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { join } from 'path';
import { HttpModule } from '@nestjs/axios';
import { ImageUserSchema } from './entities/image-user.entity';
import { UtilsService } from 'src/utils/utils.service';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}, {name: 'ImagesUser', schema: ImageUserSchema}]),
    ClientsModule.registerAsync([
      {
        name: 'RMQ_USER_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`],
            queue: 'user-messages',
            queueOptions: {
              durable: false
                  },
            },
        })
       },
    ]),
    MailerModule.forRootAsync({
        useFactory: async () => ({
          // transport: process.env.MAIL_TRANSPORT,
          
          transport: {
            host: process.env.MAIL_HOST,
            secure: false,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD,
            },
          },

        defaults: {
          from: `"No Reply" <${process.env.FROM_EMAIL}>`,
        },
        template: {
          dir: join(__dirname, '../mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
    })
  })
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UtilsService,
    RabbitmqService,
    MailService,
  ],
})
export class UsersModule {}
