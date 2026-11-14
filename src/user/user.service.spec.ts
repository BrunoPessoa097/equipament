import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserINterface } from './interface/user.interface';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('UserService', () => {
  let service: UserService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      password: 'Senha@123',
      active: true,
    };

    const mockCreatedUser: UserINterface & { id: number } = {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@example.com',
      password: 'hashedPassword123',
      active: true,
    };

    it('deve criar um usuário com a senha criptografada (hash) com sucesso', async () => {
      jest.mocked(argon2.hash).mockResolvedValue('hashedPassword123');
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);

      const result = await service.create(createUserDto);

      expect(argon2.hash).toHaveBeenCalledTimes(1);
      expect(argon2.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(result).toEqual(mockCreatedUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: 'hashedPassword123',
        },
      });
    });

    it('deve lançar erro quando o hash da senha falhar', async () => {
      const hashError = new Error('Falha ao gerar hash da senha');
      jest.mocked(argon2.hash).mockRejectedValue(hashError);

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Falha ao gerar hash da senha',
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o Prisma falhar por violação de unicidade (P2002)', async () => {
      jest.mocked(argon2.hash).mockResolvedValue('hashedPassword123');
      const prismaError = new Error(
        'Unique constraint failed on the fields: (`email`)',
      );
      Object.assign(prismaError, { code: 'P2002' });
      mockPrismaService.user.create.mockRejectedValue(prismaError);

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Unique constraint failed on the fields: (`email`)',
      );
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    const mockUsers = [
      {
        id: 1,
        name: 'João Silva',
        email: 'joao.silva@example.com',
        password: 'Senha@123',
        active: true,
      },
      {
        id: 2,
        name: 'Maria Santos',
        email: 'maria.santos@example.com',
        password: 'Senha@123',
        active: true,
      },
    ];

    it('deve retornar a listagem paginada com valores padrão (page=1, take=10)', async () => {
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);
      mockPrismaService.user.count.mockResolvedValue(2);

      const result = await service.findAll();

      expect(result).toEqual({
        dados: mockUsers,
        pagina: 1,
        limite: 10,
        total: 2,
        totalPaginas: 1,
      });
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.count).toHaveBeenCalledTimes(1);
    });

    it('deve chamar findMany com skip e take calculados corretamente para a página informada', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.count.mockResolvedValue(15);

      const result = await service.findAll(2, 5);

      expect(result.totalPaginas).toBe(3);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve lançar erro quando o Prisma falhar ao buscar os usuários', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.user.findMany.mockRejectedValue(dbError);
      mockPrismaService.user.count.mockResolvedValue(0);

      await expect(service.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findOne', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@example.com',
      password: 'Senha@123',
      active: true,
    };

    it('deve retornar o usuário quando encontrado pelo id', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve retornar null quando o usuário não for encontrado', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: 999 },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve lançar erro quando o Prisma falhar ao buscar o usuário', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.user.findFirst.mockRejectedValue(dbError);

      await expect(service.findOne(1)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'João Silva Atualizado',
    };

    const mockUpdatedUser = {
      id: 1,
      name: 'João Silva Atualizado',
      email: 'joao.silva@example.com',
      password: 'Senha@123',
      active: true,
    };

    it('deve atualizar um usuário com sucesso', async () => {
      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.update(1, updateUserDto);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve lançar erro quando o Prisma falhar por violação de unicidade (P2002)', async () => {
      const prismaError = new Error(
        'Unique constraint failed on the fields: (`name`)',
      );
      Object.assign(prismaError, { code: 'P2002' });
      mockPrismaService.user.update.mockRejectedValue(prismaError);

      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        'Unique constraint failed on the fields: (`name`)',
      );
    });

    it('deve lançar erro quando o usuário não for encontrado ou ocorrer erro no banco', async () => {
      const dbError = new Error('Record not found');
      mockPrismaService.user.update.mockRejectedValue(dbError);

      await expect(service.update(999, updateUserDto)).rejects.toThrow(
        'Record not found',
      );
    });
  });

  describe('remove', () => {
    const mockDeletedUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@example.com',
      password: 'Senha@123',
      active: true,
    };

    it('deve remover um usuário com sucesso', async () => {
      mockPrismaService.user.delete.mockResolvedValue(mockDeletedUser);

      const result = await service.remove(1);

      expect(result).toEqual(mockDeletedUser);
      expect(mockPrismaService.user.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('deve lançar erro quando o usuário a ser removido não existir', async () => {
      const dbError = new Error('Record not found');
      mockPrismaService.user.delete.mockRejectedValue(dbError);

      await expect(service.remove(999)).rejects.toThrow('Record not found');
    });

    it('deve lançar erro genérico quando o Prisma falhar ao remover', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.user.delete.mockRejectedValue(dbError);

      await expect(service.remove(1)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
