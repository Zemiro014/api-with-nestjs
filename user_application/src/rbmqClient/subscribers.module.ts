import { Module } from "@nestjs/common";
import SubscribersController from "./subscribers.controller";

@Module({
    imports:[],
    controllers: [SubscribersController],
    providers: [

    ]
})

export class SubscribersModule{}