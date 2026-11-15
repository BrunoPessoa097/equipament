import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from './dto/login.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

jest.mock('@nestjs/jwt', () => ({
  JwtService: class JwtService {},
}));

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'usuario@example.com',
      password: 'Senha@123',
    };

    it('deve delegar a autenticação ao service e retornar o token', async () => {
      const result = { access_token: 'access-token' };
      mockAuthService.login.mockResolvedValue(result);

      await expect(controller.login(loginDto)).resolves.toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao autenticar usuário');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toBe(error);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
