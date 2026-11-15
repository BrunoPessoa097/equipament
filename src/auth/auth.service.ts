import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user || !user.active) {
      this.logger.warn('Falha de autenticação: credenciais inválidas.');
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const passwordValid = await argon2.verify(user.password, loginDto.password);

    if (!passwordValid) {
      this.logger.warn('Falha de autenticação: credenciais inválidas.');
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.log(
      `Autenticação realizada com sucesso. Usuário ID: ${user.id}`,
    );
    return {
      access_token: accessToken,
    };
  }
}
