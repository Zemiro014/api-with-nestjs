import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  Swagger config
  const config = new DocumentBuilder()
    .setTitle("User application challange")
    .setDescription("Application to manage the users")
    .setVersion("1.0")
    .addTag("users")
    .build()

  //  Rabbitmq config
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
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  Logger.log(`User service running on port ${process.env.PORT}`);
}
bootstrap();
