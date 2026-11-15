import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
    }),
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Equipament')
    .setDescription('Todas as rotas da API de Equipament')
    .setVersion('1.0')
    .setContact(
      'Bruno Pessoa',
      'https://github.com/BrunoPessoa097',
      'brunopessoa097@gmail.com',
    )
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('/api/docs', app, documentFactory);
  SwaggerModule.setup('/api', app, documentFactory, {
    jsonDocumentUrl: '/api/openapi.json',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
