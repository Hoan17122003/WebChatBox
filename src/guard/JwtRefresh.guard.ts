// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { Request } from 'express';
// // import { AuthService } from '../auth.service';
// import { JwtService } from '@nestjs/jwt';
// import { AppService } from 'src/app.service';

// @Injectable()
// export class JwtRefreshTokenGuard implements CanActivate {
//     constructor(
//         private readonly authService: AppService,
//         private readonly jwtService: JwtService,
//     ) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const requests = context.switchToHttp().getRequest();
//         // refresh_token
//         const token = this.extractTokenFromHeader(requests);
//         if (!token) {
//             return false;
//         }
//         const payload = await this.jwtService.verifyAsync(token, {
//             secret: process.env.JWTREFRESHTOKENSECRET,
//         });
//         const user_id = payload.payload;

//         requests.session.user_id = user_id;
//         return this.authService.validateRefreshToken(payload.payload);
//     }

//     private extractTokenFromHeader(request: Request): string | undefined {
//         const [type, token] = request.headers.authorization.split(' ') ?? [];
//         return type === 'Bearer' ? token : undefined;
//     }
// }
