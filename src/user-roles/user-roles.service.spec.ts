import { Test, TestingModule } from '@nestjs/testing';
import { UserRolesService } from './user-roles.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRoleInterface } from './interface/user-role.interface';

describe('UserRolesService', () => {
  let service: UserRolesService;

  const mockPrismaService = {
    userRoles: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const defaultOmit = { createdAt: true, updatedAt: true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRolesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserRolesService>(UserRolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserRoleDto: CreateUserRoleDto = {
      id_user: 1,
      id_roles: 2,
    };

    const mockCreatedUserRole: UserRoleInterface = {
      id: 1,
      id_user: 1,
      id_roles: 2,
    };

    it('deve criar uma associação de user role com sucesso', async () => {
      mockPrismaService.userRoles.create.mockResolvedValue(mockCreatedUserRole);

      const result = await service.create(createUserRoleDto);

      expect(result).toEqual(mockCreatedUserRole);
      expect(mockPrismaService.userRoles.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.userRoles.create).toHaveBeenCalledWith({
        data: createUserRoleDto,
        omit: defaultOmit,
      });
    });

    it('deve lançar erro quando o Prisma falhar por violação de unicidade (P2002)', async () => {
      const prismaError = new Error(
        'Unique constraint failed on the fields: (`id_user`, `id_roles`)',
      );
      Object.assign(prismaError, { code: 'P2002' });
      mockPrismaService.userRoles.create.mockRejectedValue(prismaError);

      await expect(service.create(createUserRoleDto)).rejects.toThrow(
        'Unique constraint failed on the fields: (`id_user`, `id_roles`)',
      );
      expect(mockPrismaService.userRoles.create).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro quando o Prisma falhar com erro genérico de banco de dados', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.userRoles.create.mockRejectedValue(dbError);

      await expect(service.create(createUserRoleDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockPrismaService.userRoles.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    const mockUserRoles: UserRoleInterface[] = [
      { id: 1, id_user: 1, id_roles: 1 },
      { id: 2, id_user: 1, id_roles: 2 },
    ];

    it('deve retornar a listagem paginada com valores padrão (page=1, take=10)', async () => {
      mockPrismaService.userRoles.findMany.mockResolvedValue(mockUserRoles);
      mockPrismaService.userRoles.count.mockResolvedValue(2);

      const result = await service.findAll();

      expect(result).toEqual({
        dados: mockUserRoles,
        pagina: 1,
        limite: 10,
        total: 2,
        totalPaginas: 1,
      });
      expect(mockPrismaService.userRoles.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.userRoles.count).toHaveBeenCalledTimes(1);
    });

    it('deve chamar findMany com skip e take calculados corretamente para a página informada', async () => {
      mockPrismaService.userRoles.findMany.mockResolvedValue([]);
      mockPrismaService.userRoles.count.mockResolvedValue(15);

      const result = await service.findAll(2, 5);

      expect(result.totalPaginas).toBe(3);
      expect(mockPrismaService.userRoles.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: { id: 'asc' },
        omit: defaultOmit,
      });
    });

    it('deve lançar erro quando o Prisma falhar ao buscar os registros', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.userRoles.findMany.mockRejectedValue(dbError);
      mockPrismaService.userRoles.count.mockResolvedValue(0);

      await expect(service.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findOne', () => {
    const mockUserRole: UserRoleInterface = {
      id: 1,
      id_user: 1,
      id_roles: 2,
    };

    it('deve retornar o user role quando encontrado pelo id', async () => {
      mockPrismaService.userRoles.findFirst.mockResolvedValue(mockUserRole);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUserRole);
      expect(mockPrismaService.userRoles.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.userRoles.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: defaultOmit,
      });
    });

    it('deve retornar null quando o user role não for encontrado', async () => {
      mockPrismaService.userRoles.findFirst.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(mockPrismaService.userRoles.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.userRoles.findFirst).toHaveBeenCalledWith({
        where: { id: 999 },
        omit: defaultOmit,
      });
    });

    it('deve lançar erro quando o Prisma falhar ao buscar pelo id', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.userRoles.findFirst.mockRejectedValue(dbError);

      await expect(service.findOne(1)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('update', () => {
    const updateUserRoleDto: UpdateUserRoleDto = {
      id_roles: 3,
    };

    const mockUpdatedUserRole: UserRoleInterface = {
      id: 1,
      id_user: 1,
      id_roles: 3,
    };

    it('deve atualizar um user role com sucesso', async () => {
      mockPrismaService.userRoles.update.mockResolvedValue(mockUpdatedUserRole);

      const result = await service.update(1, updateUserRoleDto);

      expect(result).toEqual(mockUpdatedUserRole);
      expect(mockPrismaService.userRoles.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.userRoles.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserRoleDto,
        omit: defaultOmit,
      });
    });

    it('deve lançar erro quando o Prisma falhar por violação de unicidade (P2002)', async () => {
      const prismaError = new Error(
        'Unique constraint failed on the fields: (`id_user`, `id_roles`)',
      );
      Object.assign(prismaError, { code: 'P2002' });
      mockPrismaService.userRoles.update.mockRejectedValue(prismaError);

      await expect(service.update(1, updateUserRoleDto)).rejects.toThrow(
        'Unique constraint failed on the fields: (`id_user`, `id_roles`)',
      );
    });

    it('deve lançar erro quando o registro a ser atualizado não for encontrado', async () => {
      const dbError = new Error('Record not found');
      mockPrismaService.userRoles.update.mockRejectedValue(dbError);

      await expect(service.update(999, updateUserRoleDto)).rejects.toThrow(
        'Record not found',
      );
    });
  });

  describe('remove', () => {
    const mockDeletedUserRole: UserRoleInterface = {
      id: 1,
      id_user: 1,
      id_roles: 2,
    };

    it('deve remover um user role com sucesso', async () => {
      mockPrismaService.userRoles.delete.mockResolvedValue(mockDeletedUserRole);

      const result = await service.remove(1);

      expect(result).toEqual(mockDeletedUserRole);
      expect(mockPrismaService.userRoles.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.userRoles.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: defaultOmit,
      });
    });

    it('deve lançar erro quando o user role a ser removido não existir', async () => {
      const dbError = new Error('Record not found');
      mockPrismaService.userRoles.delete.mockRejectedValue(dbError);

      await expect(service.remove(999)).rejects.toThrow('Record not found');
    });

    it('deve lançar erro genérico quando o Prisma falhar ao remover', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.userRoles.delete.mockRejectedValue(dbError);

      await expect(service.remove(1)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
