import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleInterface } from './interface/roles.interface';

describe('RolesService', () => {
  let service: RolesService;

  const mockPrismaService = {
    roles: {
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
        RolesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createRoleDto: CreateRoleDto = {
      name: 'ADMIN',
      description: 'Administrator role',
      active: true,
    };

    const mockRole: RoleInterface & {
      id: number;
      createdAt: Date;
      updatedAt: Date;
    } = {
      id: 1,
      name: 'ADMIN',
      description: 'Administrator role',
      active: true,
      createdAt: new Date('2026-11-13T00:00:00.000Z'),
      updatedAt: new Date('2026-11-13T00:00:00.000Z'),
    };

    it('deve criar uma role com sucesso', async () => {
      mockPrismaService.roles.create.mockResolvedValue(mockRole);

      const result = await service.create(createRoleDto);

      expect(result).toEqual(mockRole);
      expect(mockPrismaService.roles.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.roles.create).toHaveBeenCalledWith({
        data: createRoleDto,
      });
    });

    it('deve retornar a role com os mesmos dados do DTO', async () => {
      mockPrismaService.roles.create.mockResolvedValue(mockRole);

      const result = await service.create(createRoleDto);

      expect(result.name).toBe(createRoleDto.name);
      expect(result.description).toBe(createRoleDto.description);
      expect(result.active).toBe(createRoleDto.active);
    });

    it('deve retornar a role com id gerado pelo banco de dados', async () => {
      mockPrismaService.roles.create.mockResolvedValue(mockRole);

      const result = await service.create(createRoleDto);

      expect(result).toHaveProperty('id', 1);
    });

    it('deve retornar a role com os campos createdAt e updatedAt', async () => {
      mockPrismaService.roles.create.mockResolvedValue(mockRole);

      const result = await service.create(createRoleDto);

      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect((result as typeof mockRole).createdAt).toBeInstanceOf(Date);
      expect((result as typeof mockRole).updatedAt).toBeInstanceOf(Date);
    });

    it('deve criar uma role apenas com o campo obrigatório (name)', async () => {
      const minimalDto: CreateRoleDto = {
        name: 'OPERATOR',
      } as CreateRoleDto;

      const mockMinimalRole = {
        id: 2,
        name: 'OPERATOR',
        description: null,
        active: true,
        createdAt: new Date('2026-11-13T00:00:00.000Z'),
        updatedAt: new Date('2026-11-13T00:00:00.000Z'),
      };

      mockPrismaService.roles.create.mockResolvedValue(mockMinimalRole);

      const result = await service.create(minimalDto);

      expect(result).toEqual(mockMinimalRole);
      expect(mockPrismaService.roles.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.roles.create).toHaveBeenCalledWith({
        data: minimalDto,
      });
    });

    it('deve criar uma role inativa quando active for false', async () => {
      const inactiveDto: CreateRoleDto = {
        name: 'VIEWER',
        description: 'Read-only role',
        active: false,
      };

      const mockInactiveRole = {
        id: 3,
        ...inactiveDto,
        createdAt: new Date('2026-11-13T00:00:00.000Z'),
        updatedAt: new Date('2026-11-13T00:00:00.000Z'),
      };

      mockPrismaService.roles.create.mockResolvedValue(mockInactiveRole);

      const result = await service.create(inactiveDto);

      expect(result).toEqual(mockInactiveRole);
      expect(result.active).toBe(false);
      expect(mockPrismaService.roles.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.roles.create).toHaveBeenCalledWith({
        data: inactiveDto,
      });
    });

    it('deve chamar prisma.roles.create com exatamente o DTO recebido', async () => {
      mockPrismaService.roles.create.mockResolvedValue(mockRole);

      await service.create(createRoleDto);

      expect(mockPrismaService.roles.create).toHaveBeenCalledWith({
        data: {
          name: 'ADMIN',
          description: 'Administrator role',
          active: true,
        },
      });
    });

    it('deve chamar prisma.roles.create somente uma vez por requisição', async () => {
      mockPrismaService.roles.create.mockResolvedValue(mockRole);

      await service.create(createRoleDto);

      expect(mockPrismaService.roles.create).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro quando o Prisma falhar por violação de unicidade (P2002)', async () => {
      const prismaError = new Error(
        'Unique constraint failed on the fields: (`name`)',
      );
      Object.assign(prismaError, { code: 'P2002' });

      mockPrismaService.roles.create.mockRejectedValue(prismaError);

      await expect(service.create(createRoleDto)).rejects.toThrow(
        'Unique constraint failed on the fields: (`name`)',
      );
      expect(mockPrismaService.roles.create).toHaveBeenCalledTimes(1);
    });

    it('deve propagar o código do erro quando o Prisma lançar P2002', async () => {
      const prismaError = new Error(
        'Unique constraint failed on the fields: (`name`)',
      );
      Object.assign(prismaError, { code: 'P2002' });

      mockPrismaService.roles.create.mockRejectedValue(prismaError);

      await expect(service.create(createRoleDto)).rejects.toMatchObject({
        code: 'P2002',
      });
    });

    it('deve lançar erro quando o Prisma falhar com erro genérico de banco de dados', async () => {
      const dbError = new Error('Database connection failed');

      mockPrismaService.roles.create.mockRejectedValue(dbError);

      await expect(service.create(createRoleDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockPrismaService.roles.create).toHaveBeenCalledTimes(1);
    });

    it('não deve capturar ou suprimir erros lançados pelo Prisma', async () => {
      const unexpectedError = new Error('Unexpected error');

      mockPrismaService.roles.create.mockRejectedValue(unexpectedError);

      await expect(service.create(createRoleDto)).rejects.toThrow(
        'Unexpected error',
      );
    });
  });

  describe('findAll', () => {
    const mockRoles = [
      {
        id: 1,
        name: 'ADMIN',
        description: 'Administrator role',
        active: true,
        createdAt: new Date('2026-11-13T00:00:00.000Z'),
        updatedAt: new Date('2026-11-13T00:00:00.000Z'),
      },
      {
        id: 2,
        name: 'OPERATOR',
        description: 'Operator role',
        active: true,
        createdAt: new Date('2026-11-13T00:00:00.000Z'),
        updatedAt: new Date('2026-11-13T00:00:00.000Z'),
      },
      {
        id: 3,
        name: 'VIEWER',
        description: 'Read-only role',
        active: false,
        createdAt: new Date('2026-11-13T00:00:00.000Z'),
        updatedAt: new Date('2026-11-13T00:00:00.000Z'),
      },
    ];

    it('deve retornar a listagem paginada com valores padrão (page=1, take=10)', async () => {
      mockPrismaService.roles.findMany.mockResolvedValue(mockRoles);
      mockPrismaService.roles.count.mockResolvedValue(3);

      const result = await service.findAll();

      expect(result).toEqual({
        dados: mockRoles,
        pagina: 1,
        limite: 10,
        total: 3,
        totalPaginas: 1,
      });
    });

    it('deve chamar findMany com skip e take calculados corretamente para a página 1', async () => {
      mockPrismaService.roles.findMany.mockResolvedValue(mockRoles);
      mockPrismaService.roles.count.mockResolvedValue(3);

      await service.findAll(1, 10);

      expect(mockPrismaService.roles.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updateAt: true },
      });
    });

    it('deve chamar findMany com skip e take calculados corretamente para a página 2', async () => {
      mockPrismaService.roles.findMany.mockResolvedValue([]);
      mockPrismaService.roles.count.mockResolvedValue(15);

      await service.findAll(2, 5);

      expect(mockPrismaService.roles.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updateAt: true },
      });
    });

    it('deve calcular o total de páginas corretamente', async () => {
      mockPrismaService.roles.findMany.mockResolvedValue(mockRoles);
      mockPrismaService.roles.count.mockResolvedValue(25);

      const result = await service.findAll(1, 10);

      expect(result.totalPaginas).toBe(3);
    });

    it('deve arredondar o total de páginas para cima quando não for divisão exata', async () => {
      mockPrismaService.roles.findMany.mockResolvedValue(mockRoles);
      mockPrismaService.roles.count.mockResolvedValue(11);

      const result = await service.findAll(1, 10);

      expect(result.totalPaginas).toBe(2);
    });

    it('deve retornar total de 1 página quando o total de registros for igual ao limite', async () => {
      mockPrismaService.roles.findMany.mockResolvedValue(mockRoles);
      mockPrismaService.roles.count.mockResolvedValue(10);

      const result = await service.findAll(1, 10);

      expect(result.totalPaginas).toBe(1);
    });

    it('deve retornar dados vazios quando não houver registros', async () => {
      mockPrismaService.roles.findMany.mockResolvedValue([]);
      mockPrismaService.roles.count.mockResolvedValue(0);

      const result = await service.findAll();

      expect(result).toEqual({
        dados: [],
        pagina: 1,
        limite: 10,
        total: 0,
        totalPaginas: 0,
      });
    });

    it('deve retornar a pagina e o limite informados na resposta', async () => {
      mockPrismaService.roles.findMany.mockResolvedValue(mockRoles);
      mockPrismaService.roles.count.mockResolvedValue(30);

      const result = await service.findAll(3, 5);

      expect(result.pagina).toBe(3);
      expect(result.limite).toBe(5);
    });

    it('deve chamar findMany e count exatamente uma vez por requisição', async () => {
      mockPrismaService.roles.findMany.mockResolvedValue(mockRoles);
      mockPrismaService.roles.count.mockResolvedValue(3);

      await service.findAll();

      expect(mockPrismaService.roles.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.roles.count).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro quando o findMany do Prisma falhar', async () => {
      const dbError = new Error('Database connection failed');

      mockPrismaService.roles.findMany.mockRejectedValue(dbError);
      mockPrismaService.roles.count.mockResolvedValue(0);

      await expect(service.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('deve lançar erro quando o count do Prisma falhar', async () => {
      const dbError = new Error('Database connection failed');

      mockPrismaService.roles.findMany.mockResolvedValue(mockRoles);
      mockPrismaService.roles.count.mockRejectedValue(dbError);

      await expect(service.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findOne', () => {
    const mockRole = {
      id: 1,
      name: 'ADMIN',
      description: 'Administrator role',
      active: true,
      createdAt: new Date('2026-11-13T00:00:00.000Z'),
      updatedAt: new Date('2026-11-13T00:00:00.000Z'),
    };

    it('deve retornar a role quando encontrada pelo id', async () => {
      mockPrismaService.roles.findFirst.mockResolvedValue(mockRole);

      const result = await service.findOne(1);

      expect(result).toEqual(mockRole);
      expect(mockPrismaService.roles.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.roles.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: { createdAt: true, updateAt: true },
      });
    });

    it('deve retornar null quando a role não for encontrada', async () => {
      mockPrismaService.roles.findFirst.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(mockPrismaService.roles.findFirst).toHaveBeenCalledWith({
        where: { id: 999 },
        omit: { createdAt: true, updateAt: true },
      });
    });

    it('deve lançar erro quando o Prisma falhar', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.roles.findFirst.mockRejectedValue(dbError);

      await expect(service.findOne(1)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('update', () => {
    const updateRoleDto: UpdateRoleDto = {
      name: 'SUPER_ADMIN',
      description: 'Updated description',
    };

    const mockUpdatedRole = {
      id: 1,
      name: 'SUPER_ADMIN',
      description: 'Updated description',
      active: true,
      createdAt: new Date('2026-11-13T00:00:00.000Z'),
      updatedAt: new Date('2026-11-13T00:00:00.000Z'),
    };

    it('deve atualizar uma role com sucesso', async () => {
      mockPrismaService.roles.update.mockResolvedValue(mockUpdatedRole);

      const result = await service.update(1, updateRoleDto);

      expect(result).toEqual(mockUpdatedRole);
      expect(mockPrismaService.roles.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.roles.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { updateRoleDto },
        omit: { createdAt: true, updateAt: true },
      });
    });

    it('deve lançar erro quando o Prisma falhar ao atualizar', async () => {
      const dbError = new Error('Record not found');
      mockPrismaService.roles.update.mockRejectedValue(dbError);

      await expect(service.update(1, updateRoleDto)).rejects.toThrow(
        'Record not found',
      );
    });
  });

  describe('remove', () => {
    const mockDeletedRole = {
      id: 1,
      name: 'ROLE_TO_DELETE',
      description: 'Role to be deleted',
      active: true,
      createdAt: new Date('2026-11-13T00:00:00.000Z'),
      updatedAt: new Date('2026-11-13T00:00:00.000Z'),
    };

    it('deve remover uma role com sucesso', async () => {
      mockPrismaService.roles.delete.mockResolvedValue(mockDeletedRole);

      const result = await service.remove(1);

      expect(result).toEqual(mockDeletedRole);
      expect(mockPrismaService.roles.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.roles.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('deve lançar erro quando o Prisma falhar ao remover', async () => {
      const dbError = new Error('Record not found');
      mockPrismaService.roles.delete.mockRejectedValue(dbError);

      await expect(service.remove(1)).rejects.toThrow('Record not found');
    });
  });
});
