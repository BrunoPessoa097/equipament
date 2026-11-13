import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

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
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
