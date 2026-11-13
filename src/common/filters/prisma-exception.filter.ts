import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '../../generated/prisma/client';

//catpturar os erros
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter<Prisma.PrismaClientKnownRequestError> {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<{
      method: string;
      url: string;
    }>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro interno. Tente novamente.';
    let error = 'Internal Server Error';

    switch (exception.code) {
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        message = 'Já existe um registro com esses dados.';
        error = 'Conflict';
        break;

      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Registro não encontrado.';
        error = 'Not Found';
        break;
    }

    // Informações técnicas para o desenvolvedor.
    this.logger.error(
      JSON.stringify({
        code: exception.code,
        target: exception.meta?.target,
        method: request.method,
        path: request.url,
      }),
    );

    // Resposta pública para o cliente.
    httpAdapter.reply(
      ctx.getResponse(),
      {
        statusCode,
        message,
        error,
      },
      statusCode,
    );
  }
}
