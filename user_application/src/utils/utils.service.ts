import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import * as fs from 'fs';

@Injectable()
export class UtilsService{
    constructor(private readonly httpService: HttpService){}

    async getImageDataByUrl(url: string): Promise<Buffer> {
        const response: AxiosResponse = await this.httpService.get(url, { responseType: 'arraybuffer' }).toPromise();
        return Buffer.from(response.data, 'binary');
      }
    
    async saveFileInFileSystemByUrl({url, fileName}) {
        const filePath = `../files/${fileName}.jpg`
        await this.getImageDataByUrl(url)
          .then(resp => {
            fs.writeFile(filePath, resp, (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log('Image saved successfully in files folder');
              }
            });
          })
      }

      removeFileFromSystemFile(fileName: string) {
        const filePath = `../files/${fileName}.jpg`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`File ${filePath} has been deleted`);
        });
      }

    async convertFileToBase64ByUrl(url: string): Promise<any> {
      const response = await this.httpService.axiosRef.get(url, {responseType: 'arraybuffer'})
      .then(res => {       
        const base64Image = Buffer.from(res.data, 'binary').toString('base64');
        return { imageBase64: base64Image };
       })
      return response;
    }
}