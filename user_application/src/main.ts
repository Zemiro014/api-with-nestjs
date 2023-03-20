import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`],
      queue: process.env.RABBITMQ_QUEUE_NAME,
      queueOptions: {
        durable: false,
      }
    }
  })
  app.startAllMicroservices();
  await app.listen(process.env.PORT);
  Logger.log(`User service running on port ${process.env.PORT}`);
}
bootstrap();
