import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from "body-parser"
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './common/guards';
import { Email } from './common/guards/email.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.use(bodyParser.json({limit: '50mb'}))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  const reflector = new Reflector()
  app.useGlobalGuards(new AtGuard(reflector), new Email(reflector))
  await app.listen(3001);
}
bootstrap();
