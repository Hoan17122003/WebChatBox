// import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { Request } from 'express';
// import { Reflector } from '@nestjs/core';

// import { JwtService } from '@nestjs/jwt';
// import { AppService } from 'src/app.service';
// // import { AuthService } from '../auth.service';
// // import { UserService } from 'src/user/user.service';
// @Injectable()
// export class JwtAccessAuth implements CanActivate {
//     constructor(
//         private readonly jwtService: JwtService,
//         private readonly reflector: Reflector,
//         private readonly userServie: AppService,
//     ) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//         //     context.getHandler(),
//         //     context.getClass(),
//         // ]);
//         // if (isPublic) return true;
//         const requests = context.switchToHttp().getRequest();
//         const token = this.extractTokenFromHeader(requests);

//         if (!token) throw new ForbiddenException('Không thể truy cập tài nguyên do token của bạn không hợp lệ');
//         try {
//             const payload = await this.jwtService.verifyAsync(token, {
//                 secret: process.env.JWTACCESSTOKENSECRET,
//             });
//             const { user_id } = payload;
//             const user = await this.userServie.findById(user_id);
//             if (!user) throw new ForbiddenException('User not found');
//             requests.session.user_id = user_id;
//         } catch (error) {
//             throw new ForbiddenException(error);
//         }

//         return true;
//     }

//     private extractTokenFromHeader(requests: Request): string | undefined {
//         const [type, token] = requests.headers['authorization']?.split(' ') ?? [];
//         return type === 'Bearer' ? token : undefined;
//     }
// }
