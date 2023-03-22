import { Module } from "@nestjs/common";
// import { ClientsModule, Transport } from "@nestjs/microservices";
import { RabbitmqService } from "./rabbitmq.service";

@Module({
    imports: [],
    providers: [RabbitmqService]
})
export class RabbitmqModule{}