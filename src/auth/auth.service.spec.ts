import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

jest.mock('argon2');
jest.mock('@nestjs/jwt', () => ({
  JwtService: class JwtService {},
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const loginDto: LoginDto = {
    email: 'usuario@example.com',
    password: 'Senha@123',
  };

  const user = {
    id: 1,
    email: loginDto.email,
    password: 'hashed-password',
    active: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('deve autenticar usuário ativo e retornar o token de acesso', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest.mocked(argon2.verify).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('access-token');

      await expect(service.login(loginDto)).resolves.toEqual({
        access_token: 'access-token',
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(argon2.verify).toHaveBeenCalledWith(
        user.password,
        loginDto.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });

    it('deve rejeitar autenticação quando o usuário não existir', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(argon2.verify).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('deve rejeitar autenticação quando o usuário estiver inativo', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...user,
        active: false,
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(argon2.verify).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('deve rejeitar autenticação quando a senha for inválida', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest.mocked(argon2.verify).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Falha ao buscar usuário');
      mockPrismaService.user.findUnique.mockRejectedValue(error);

      await expect(service.login(loginDto)).rejects.toBe(error);
    });
  });
});
