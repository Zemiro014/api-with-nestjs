import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { UtilsService } from 'src/utils/utils.service';
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
    private readonly httpService: HttpService,
    private utilsService: UtilsService,
    private rabbitmqService: RabbitmqService,
    private mailService: MailService,
  ){}

  create(createUserDto: CreateUserDto): Promise<User> {
    const entityCreated = new this.userModel(createUserDto);
    const response = entityCreated.save();
    response.then( async resp => {

      //  Send Email
      this.mailService.sendEmail({toEmail: resp.email, name: resp.first_name})
    
      //  Creatinf Event in Rabbitmq
      this.rabbitmqService.createUserDataEvent({
        mongo_id  : resp._id,
        email     : resp.email,
        firstName : resp.first_name,
        lastName  : resp.last_name,
        urlImage  : resp.avatar
      })
    })
    return response;
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  findOne(id: number): Promise<ResponseUserDto> {
    const response = this.httpService.axiosRef.get(process.env.EXTERNAL_API_BASE_URL+id)
    const data = response.then(resp => {
      return resp.data.data as ResponseUserDto;
    })
    return data;
  }

  findAvatar(id: number) {
   
    const response = this.httpService.axiosRef.get(process.env.EXTERNAL_API_BASE_URL+id)

    const result = response
    .then(async resp => {

      //  Save image in file system
      this.utilsService.saveFileInFileSystemByUrl({url: resp.data.data.avatar, fileName: id+''});


      // Convert image to base64
      const base64Image = await this.utilsService.convertFileToBase64ByUrl(resp.data.data.avatar)
          .then(resp => { return resp.imageBase64 })

      const createImageUser: CreateImageUserDto = new CreateImageUserDto;
      createImageUser.userId = id+'';
      createImageUser.userImageBase64 = base64Image;

      const entityCreated = new this.imageUserModel(createImageUser);

      // Save encoded image in mongodb
      const imageResponse = entityCreated.save()
        .then(res => {
          return {
            id: res._id,
            userId: res.userId,
            avatarBase64: res.userImageBase64
          }
        });

      return imageResponse;
    })
    return result;
  }

  remove(id: string) {
    const fileName = id;
    this.utilsService.removeFileFromSystemFile(fileName)
    const response = this.imageUserModel.deleteMany({userId: id})
    .then(resp => {
      return resp
    })
    return response;
  }
}
