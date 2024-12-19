import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from './model/entities/User.entity';
import { Repository } from 'typeorm';
// import { Content } from './model/entities/Content.entity';
import { UserRegisterDTO } from './dto/request/UserRegister';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
// import { File } from './model/entities/File.entity';
import { PdfService } from './script/PdfService.service';

@Injectable()
export class AppService {
    constructor(
        // @InjectRepository(User) private readonly userRepository: Repository<User>,
        // @InjectRepository(File)
        // private readonly historyRepository: Repository<File>,
        // @InjectRepository(Content)
        // private readonly contentRepository: Repository<Content>,
        private readonly jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly pdfService: PdfService,
    ) {}
    // async register(userRegisterDTO: UserRegisterDTO): Promise<User | string> {
    //     const userMapper = userRegisterDTO as User;
    //     const userCheck = await this.userRepository.findOne({
    //         where: [
    //             {
    //                 username: userMapper.username,
    //             },
    //             {
    //                 email: userMapper.email,
    //             },
    //         ],
    //     });
    //     if (userCheck) return `${userCheck.email} ? ${userCheck.email} | ${userCheck.username}` + 'đã tồn tại';
    //     // return this.contentRepository.save(userMapper);
    // }

    // async validate(username: string, matkhau: string) {
    //     const user: User = await this.userRepository.findOne({
    //         where: [
    //             {
    //                 email: username,
    //             },
    //             {
    //                 username: username,
    //             },
    //         ],
    //     });
    //     if (!user) throw new UnauthorizedException('thông tin đăng nhập không chính xác');
    //     if (user && (await (await user).verifyPassword(matkhau))) {
    //         const { password, ...result } = user;
    //         return result;
    //     }
    //     return null;
    // }
    public async generateAccessToken(userID: number): Promise<string> {
        return this.jwtService.sign(
            {
                userID,
            },
            {
                secret: process.env.JWT_SECRET_ACCESS,
                expiresIn: '3h',
            },
        );
    }
    public async generateRefreshToken(userID: number): Promise<string> {
        return this.jwtService.sign(
            {
                userID,
            },
            {
                secret: process.env.JWT_SECRET_REFRESH,
                expiresIn: '1d',
            },
        );
    }
    public async login(userID: number): Promise<{ access_token: string; refresh_token: string }> {
        const result = {
            access_token: await this.generateAccessToken(userID),
            refresh_token: await this.generateRefreshToken(userID),
        };
        this.cacheManager.set(`refresh_token - ${userID} : `, result.refresh_token, 60 * 60 * 60 * 24);
        return result;
    }

    public async logout(userID: number) {
        this.cacheManager.del(`refresh_token - ${userID} : `);
    }

    public async uploadFilePdfToGraphDB(file: Express.Multer.File): Promise<string> {
        return this.pdfService.processPdf(file);
    }

    // public async findById(id: number) {
    //     return this.userRepository.findOne({
    //         where: {
    //             userid: id,
    //         },
    //     });
    // }
    // public async validateRefreshToken(userid: number) {
    //     return this.userRepository.findOne({
    //         where: {
    //             userid,
    //         },
    //     })
    //         ? true
    //         : false;
    // }
}
