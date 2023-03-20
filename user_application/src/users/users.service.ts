import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {

constructor(
  @InjectModel('User') private userModel: Model<UserDocument>,
  @Inject('RMQ_USER_SERVICE') private clientProxy: ClientProxy,
  ){}

  create(createUserDto: CreateUserDto): Promise<User> {
    const entityCreated = new this.userModel(createUserDto);
    const response = entityCreated.save();
    response.then( async resp => {

      //  Send Email

      //  Creatinf Event in Rabbitmq
      const result = await this.clientProxy.send({cmd: 'create-user-data'}, {
        firstName: resp.first_name,
        lastName: resp.last_name,
        urlImage: resp.avatar
      })
      await result.subscribe();
    })
    return response;
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
    // return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
