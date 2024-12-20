// import {
//     Global,
//     Injectable,
//     CanActivate,
//     ExecutionContext,
//     ForbiddenException,
//     UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { AppService } from 'src/app.service';
// @Injectable()
// export class LocalAuthGuard implements CanActivate {
//     constructor(
//         private jwtService: JwtService,
//         private appService: AppService,
//     ) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         try {
//             const request = context.switchToHttp().getRequest();
//             const { username, password } = request.body;
//             if (!username || !password) throw new UnauthorizedException('thông tin không được bỏ trống');
//             const payload = await this.appService.validate(username, password);
//             request.session.payload = payload;
//         } catch (error) {
//             throw new UnauthorizedException(error);
//         }
//         return true;
//     }
// }
