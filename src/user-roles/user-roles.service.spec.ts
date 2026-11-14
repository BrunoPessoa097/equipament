import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRoleInterface } from './interface/user-role.interface';
import { UserRolesService } from './user-roles.service';

describe('UserRolesService', () => {
  let service: UserRolesService;

  const mockPrismaService = {
    user: { findUnique: jest.fn() },
    roles: { findUnique: jest.fn() },
    userRoles: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const defaultOmit = { createdAt: true, updatedAt: true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRolesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserRolesService>(UserRolesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateUserRoleDto = { id_user: 1, id_roles: 2 };
    const created: UserRoleInterface = { id: 1, ...dto };

    it('deve criar a associação quando usuário e role existem', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.roles.findUnique.mockResolvedValue({ id: 2 });
      mockPrismaService.userRoles.create.mockResolvedValue(created);

      await expect(service.create(dto)).resolves.toEqual(created);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true },
      });
      expect(mockPrismaService.roles.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
        select: { id: true },
      });
      expect(mockPrismaService.userRoles.create).toHaveBeenCalledWith({
        data: dto,
        omit: defaultOmit,
      });
    });

    it('deve lançar NotFoundException quando o usuário não existir', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.roles.findUnique.mockResolvedValue({ id: 2 });

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.userRoles.create).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando a role não existir', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.roles.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.userRoles.create).not.toHaveBeenCalled();
    });

    it('deve propagar falha do Prisma', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.roles.findUnique.mockResolvedValue({ id: 2 });
      mockPrismaService.userRoles.create.mockRejectedValue(new Error('Falha no banco'));

      await expect(service.create(dto)).rejects.toThrow('Falha no banco');
    });
  });

  describe('findAll', () => {
    const records: UserRoleInterface[] = [
      { id: 1, id_user: 1, id_roles: 1 },
      { id: 2, id_user: 1, id_roles: 2 },
    ];

    it('deve retornar a listagem paginada com os valores padrão', async () => {
      mockPrismaService.userRoles.findMany.mockResolvedValue(records);
      mockPrismaService.userRoles.count.mockResolvedValue(2);

      await expect(service.findAll()).resolves.toEqual({
        dados: records,
        pagina: 1,
        limite: 10,
        total: 2,
        totalPaginas: 1,
      });
      expect(mockPrismaService.userRoles.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        omit: defaultOmit,
      });
    });

    it('deve calcular o deslocamento e o total de páginas', async () => {
      mockPrismaService.userRoles.findMany.mockResolvedValue([]);
      mockPrismaService.userRoles.count.mockResolvedValue(15);

      await expect(service.findAll(2, 5)).resolves.toMatchObject({
        pagina: 2,
        limite: 5,
        total: 15,
        totalPaginas: 3,
      });
      expect(mockPrismaService.userRoles.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: { id: 'asc' },
        omit: defaultOmit,
      });
    });

    it('deve propagar falha do Prisma', async () => {
      mockPrismaService.userRoles.findMany.mockRejectedValue(new Error('Falha no banco'));
      mockPrismaService.userRoles.count.mockResolvedValue(0);

      await expect(service.findAll()).rejects.toThrow('Falha no banco');
    });
  });

  describe('findOne', () => {
    const record: UserRoleInterface = { id: 1, id_user: 1, id_roles: 2 };

    it('deve buscar a associação pelo id', async () => {
      mockPrismaService.userRoles.findUniqueOrThrow.mockResolvedValue(record);

      await expect(service.findOne(1)).resolves.toEqual(record);
      expect(mockPrismaService.userRoles.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: defaultOmit,
      });
    });

    it('deve propagar erro quando a associação não existir', async () => {
      mockPrismaService.userRoles.findUniqueOrThrow.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.findOne(999)).rejects.toThrow('Record not found');
    });
  });

  describe('update', () => {
    const dto: UpdateUserRoleDto = { id_roles: 3 };
    const updated: UserRoleInterface = { id: 1, id_user: 1, id_roles: 3 };

    it('deve atualizar a associação', async () => {
      mockPrismaService.userRoles.update.mockResolvedValue(updated);

      await expect(service.update(1, dto)).resolves.toEqual(updated);
      expect(mockPrismaService.userRoles.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
        omit: defaultOmit,
      });
    });

    it('deve propagar erro quando a associação não existir', async () => {
      mockPrismaService.userRoles.update.mockRejectedValue(new Error('Record not found'));

      await expect(service.update(999, dto)).rejects.toThrow('Record not found');
    });
  });

  describe('remove', () => {
    const deleted: UserRoleInterface = { id: 1, id_user: 1, id_roles: 2 };

    it('deve remover a associação', async () => {
      mockPrismaService.userRoles.delete.mockResolvedValue(deleted);

      await expect(service.remove(1)).resolves.toEqual(deleted);
      expect(mockPrismaService.userRoles.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: defaultOmit,
      });
    });

    it('deve propagar erro quando a associação não existir', async () => {
      mockPrismaService.userRoles.delete.mockRejectedValue(new Error('Record not found'));

      await expect(service.remove(999)).rejects.toThrow('Record not found');
    });
  });
});
