import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { mensagem: string } {
    return { mensagem: 'Hello World!' };
  }
}
