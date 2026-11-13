import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RolesController', () => {
  let controller: RolesController;

  const mockRolesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createRoleDto: CreateRoleDto = {
      name: 'ADMIN',
      description: 'Administrator role',
      active: true,
    };

    it('deve criar uma role com sucesso', async () => {
      const mockCreatedRole = {
        id: 1,
        ...createRoleDto,
      };

      mockRolesService.create.mockResolvedValue(mockCreatedRole);

      const result = await controller.create(createRoleDto);

      expect(result).toEqual(mockCreatedRole);
      expect(mockRolesService.create).toHaveBeenCalledTimes(1);
      expect(mockRolesService.create).toHaveBeenCalledWith(createRoleDto);
    });

    it('deve repassar erro de conflito quando o service falhar por duplicidade', async () => {
      const conflictError = new ConflictException(
        'Já existe um registro com esses dados.',
      );
      mockRolesService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createRoleDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRolesService.create).toHaveBeenCalledTimes(1);
    });

    it('deve repassar erro inesperado quando o service falhar', async () => {
      const dbError = new InternalServerErrorException(
        'Erro no banco de dados',
      );
      mockRolesService.create.mockRejectedValue(dbError);

      await expect(controller.create(createRoleDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockRolesService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve retornar a listagem de roles com sucesso', async () => {
      const mockResult = {
        dados: [{ id: 1, name: 'ADMIN', description: 'Admin', active: true }],
        pagina: 1,
        limite: 10,
        total: 1,
        totalPaginas: 1,
      };

      mockRolesService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(mockRolesService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não houver roles cadastradas', async () => {
      const mockEmptyResult = {
        dados: [],
        pagina: 1,
        limite: 10,
        total: 0,
        totalPaginas: 0,
      };

      mockRolesService.findAll.mockResolvedValue(mockEmptyResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockEmptyResult);
      expect(mockRolesService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve repassar erro quando o service falhar ao buscar a listagem', async () => {
      const dbError = new InternalServerErrorException('Erro ao listar');
      mockRolesService.findAll.mockRejectedValue(dbError);

      await expect(controller.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockRolesService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve buscar uma role pelo id com sucesso', async () => {
      const mockRole = {
        id: 1,
        name: 'ADMIN',
        description: 'Admin',
        active: true,
      };

      mockRolesService.findOne.mockResolvedValue(mockRole);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockRole);
      expect(mockRolesService.findOne).toHaveBeenCalledTimes(1);
      expect(mockRolesService.findOne).toHaveBeenCalledWith(1);
    });

    it('deve retornar null quando a role não for encontrada', async () => {
      mockRolesService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
      expect(mockRolesService.findOne).toHaveBeenCalledTimes(1);
      expect(mockRolesService.findOne).toHaveBeenCalledWith(999);
    });

    it('deve repassar erro quando o service falhar ao buscar pelo id', async () => {
      const dbError = new InternalServerErrorException('Erro ao buscar role');
      mockRolesService.findOne.mockRejectedValue(dbError);

      await expect(controller.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockRolesService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    const updateRoleDto: UpdateRoleDto = {
      name: 'SUPER_ADMIN',
    };

    it('deve atualizar uma role com sucesso', async () => {
      const mockUpdatedRole = {
        id: 1,
        name: 'SUPER_ADMIN',
        description: 'Admin',
        active: true,
      };

      mockRolesService.update.mockResolvedValue(mockUpdatedRole);

      const result = await controller.update(1, updateRoleDto);

      expect(result).toEqual(mockUpdatedRole);
      expect(mockRolesService.update).toHaveBeenCalledTimes(1);
      expect(mockRolesService.update).toHaveBeenCalledWith(1, updateRoleDto);
    });

    it('deve repassar erro quando o registro a ser atualizado não for encontrado', async () => {
      const notFoundError = new NotFoundException('Role não encontrada');
      mockRolesService.update.mockRejectedValue(notFoundError);

      await expect(controller.update(999, updateRoleDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRolesService.update).toHaveBeenCalledTimes(1);
      expect(mockRolesService.update).toHaveBeenCalledWith(999, updateRoleDto);
    });

    it('deve repassar erro quando o service falhar por duplicidade ao atualizar', async () => {
      const conflictError = new ConflictException('Nome já em uso');
      mockRolesService.update.mockRejectedValue(conflictError);

      await expect(controller.update(1, updateRoleDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRolesService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve remover uma role com sucesso', async () => {
      const mockDeletedRole = {
        id: 1,
        name: 'ADMIN',
        description: 'Admin',
        active: true,
      };

      mockRolesService.remove.mockResolvedValue(mockDeletedRole);

      const result = await controller.remove(1);

      expect(result).toEqual(mockDeletedRole);
      expect(mockRolesService.remove).toHaveBeenCalledTimes(1);
      expect(mockRolesService.remove).toHaveBeenCalledWith(1);
    });

    it('deve repassar erro quando a role a ser removida não existir', async () => {
      const notFoundError = new NotFoundException('Role não encontrada');
      mockRolesService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockRolesService.remove).toHaveBeenCalledTimes(1);
      expect(mockRolesService.remove).toHaveBeenCalledWith(999);
    });

    it('deve repassar erro inesperado quando o service falhar ao remover', async () => {
      const dbError = new InternalServerErrorException('Erro ao remover');
      mockRolesService.remove.mockRejectedValue(dbError);

      await expect(controller.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockRolesService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
