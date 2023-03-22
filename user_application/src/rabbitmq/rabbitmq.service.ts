import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class RabbitmqService{
    constructor(@Inject('RMQ_USER_SERVICE') private clientProxy: ClientProxy,){}

    async createUserDataEvent( data: any) {
        const response = await this.clientProxy.send({cmd: 'create-user-data'}, data)
        await response.subscribe()
    }
}