import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy, Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('RMQ_USER_SERVICE') private clientProxy: ClientProxy,
    ) {}

  @Post()
   create(@Body() createUserDto: CreateUserDto) {
    const response = this.usersService.create(createUserDto);
    response.then( async resp => {
      const result = await this.clientProxy.send({cmd: 'create-user-data'}, {
        firstName: resp.first_name,
        lastName: resp.last_name,
        urlImage: resp.avatar
      })
      await result.subscribe();
    })
    return response;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @MessagePattern({cmd: "get-user"})
  async getUser(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const message = context.getMessage()
    channel.ack(message)
    return{
      user: 'USER'
    }
  }
}
