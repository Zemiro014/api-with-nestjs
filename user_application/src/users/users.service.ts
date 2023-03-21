import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateImageUserDto } from './dto/create-image-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { ImageUserDocument } from './entities/image-user.entity';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {

constructor(
  @InjectModel('User') private userModel: Model<UserDocument>,
  @InjectModel('ImagesUser') private imageUserModel: Model<ImageUserDocument>,
  @Inject('RMQ_USER_SERVICE') private clientProxy: ClientProxy,
  private mailerService: MailerService,
  private httpServcie: HttpService
  ){}

  create(createUserDto: CreateUserDto): Promise<User> {
    const entityCreated = new this.userModel(createUserDto);
    const response = entityCreated.save();
    response.then( async resp => {

      //  Send Email
      await this.mailerService.sendMail({
        to: resp.email,
        from: process.env.FROM_EMAIL,
        subject: 'Greeting from NestJS NodeMailer',
        template: './email',
        context: {
            name: resp.first_name
        }
    })
    
      //  Creatinf Event in Rabbitmq
      const result = await this.clientProxy.send({cmd: 'create-user-data'}, {
        mongo_id : resp._id,
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
  }

  findOne(id: number): Promise<ResponseUserDto> {
    const response = this.httpServcie.axiosRef.get(process.env.EXTERNAL_API_BASE_URL+id)
    const data = response.then(resp => {
      return resp.data.data as ResponseUserDto;
    })
    return data;
  }

  findAvatar(id: number) {
   
    const response = this.httpServcie.axiosRef.get(process.env.EXTERNAL_API_BASE_URL+id)

    const result = response.then(async resp => {
     const respResult = await this.httpServcie.axiosRef.get(resp.data.data.avatar, {responseType: 'arraybuffer'})
     .then(res => {       
        const base64Image = Buffer.from(res.data, 'binary').toString('base64');

        const createImageUser: CreateImageUserDto = new CreateImageUserDto;
        createImageUser.userId = id+'';
        createImageUser.userImageBase64 = base64Image;
        const entityCreated = new this.imageUserModel(createImageUser);
        const imageResponse = entityCreated.save().then(res => {
          return {id: res._id, userId: res.userId,  avatarBase64: res.userImageBase64}
        });
        return imageResponse;
      })

      return respResult;
    })
    return result;
  }

  remove(id: string) {
    const response = this.imageUserModel.deleteMany({userId: id})
    .then(resp => {
      return resp
    })
    return response;
  }
}
