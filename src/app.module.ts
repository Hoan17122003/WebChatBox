import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { ScriptModule } from './script/Script.module';
import { Content } from './model/Content';
import { User } from './model/User';
import { File } from './model/File';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 60, // 1 hour
      // max: 100, // maximum number of items in the cache
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.MYSQL_DB_HOST,
        port: Number.parseInt(process.env.MYSQL_DB_PORT),
        username: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
        // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User, File, Content]),
    JwtModule.register({}),
    ScriptModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
