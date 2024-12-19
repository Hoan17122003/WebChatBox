import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserRegisterDTO } from './dto/request/UserRegister';
// import { LocalAuthGuard } from './guard/LocalAuth.guard';
// import { User } from './model/entities/User.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import path, { extname } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('/user/register')
  // async Register(@Body() createUserDTO: UserRegisterDTO): Promise<ResponseObject> {
  //     const user = await this.appService.register(createUserDTO);
  //     return {
  //         status: HttpStatus.OK,
  //         message: 'create user successfully',
  //     } as ResponseObject;
  // }
  // @UseGuards(LocalAuthGuard)
  // @Post('/user/login')
  // async Login(@Session() session : Record<string,any>) : Promise<ResponseObject {
  //     const user = session.payload as User;
  //     return {
  //         status : HttpStatus.OK,
  //         data : await this.appService.login(user.userid),
  //         message : 'login successfully'
  //     } as ResponseObject;
  // }
  @Post('upload')
  //   @UseInterceptors(
  //     FileInterceptor('file', {
  //       // 'file' ở đây phải trùng với key bạn dùng trong Postman
  //       storage: diskStorage({
  //         destination: './uploads',
  //         filename: (req, file, cb) => {
  //           const uniqueSuffix = Date.now() + extname(file.originalname);
  //           cb(null, file.fieldname + '-' + uniqueSuffix);
  //         },
  //       }),
  //     }),
  //   )
  @UseInterceptors(FileInterceptor('file')) // "file" ở đây phải khớp với key trong Postman
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file); // Kiểm tra console.log xem file có được nhận đúng không
    return this.appService.uploadFilePdfToGraphDB(file);
  }
}
