import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.prod' });

async function bootstrap() {
    console.log(`mysql host : ${process.env.MYSQL_DB_HOST}`);
    const app = await NestFactory.create(AppModule);
    await app.listen(8080);
}
bootstrap();
