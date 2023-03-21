import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    ) {}

  @Post()
   create(@Body() createUserDto: CreateUserDto) {
    const response = this.usersService.create(createUserDto);
    return response;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get(':userId/avatar')
  findAvatar(@Param('userId') id: string) {
    return this.usersService.findAvatar(+id);
  }

  @Delete(':userId/avatar')
  remove(@Param('userId') id: string) {
    return this.usersService.remove(id);
  }
}
