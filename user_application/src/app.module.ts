import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env'
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URI),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: 'USER_SERVICE',
    //   useFactory: () => {
    //     return ClientProxyFactory.create({
    //       transport: Transport.RMQ,
    //       options: {
    //         urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`],
    //         queue: 'user-messages',
    //         queueOptions: {
    //           durable: true
    //               },
    //         },
    //     })
    //   }
    // }
  ],
})
export class AppModule {}
