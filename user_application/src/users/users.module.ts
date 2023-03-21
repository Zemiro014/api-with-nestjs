import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
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
            // debug: true,
            // logger: true
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
  providers: [UsersService],
})
export class UsersModule {}
