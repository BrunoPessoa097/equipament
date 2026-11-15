jest.mock('../auth/jwt-auth.guard', () => ({
  JwtAuthGuard: class JwtAuthGuard {},
}));
jest.mock('../common/guards/roles.guard', () => ({
  RolesGuard: class RolesGuard {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { CreateStorageEquipUserDto } from './dto/create-storage-equip-user.dto';
import { UpdateStorageEquipUserDto } from './dto/update-storage-equip-user.dto';
import { StorageEquipUserController } from './storage-equip-user.controller';
import { StorageEquipUserService } from './storage-equip-user.service';

describe('StorageEquipUserController', () => {
  let controller: StorageEquipUserController;

  const mockStorageEquipUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const relation = { id_user: 1, id_storage: 2, id_equipament: 3 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageEquipUserController],
      providers: [
        {
          provide: StorageEquipUserService,
          useValue: mockStorageEquipUserService,
        },
      ],
    }).compile();

    controller = module.get<StorageEquipUserController>(
      StorageEquipUserController,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateStorageEquipUserDto = {
      id_user: 1,
      id_storage: 2,
      id_equipament: 3,
    };

    it('deve delegar a criação ao service e retornar o resultado', async () => {
      mockStorageEquipUserService.create.mockResolvedValue(relation);

      await expect(controller.create(dto)).resolves.toEqual(relation);
      expect(mockStorageEquipUserService.create).toHaveBeenCalledWith(dto);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao criar relação');
      mockStorageEquipUserService.create.mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toBe(error);
    });
  });

  describe('findAll', () => {
    it('deve delegar a listagem ao service e retornar o resultado', async () => {
      const result = {
        dados: [relation],
        pagina: 1,
        limite: 10,
        total: 1,
        totalPaginas: 1,
      };
      mockStorageEquipUserService.findAll.mockResolvedValue(result);

      await expect(controller.findAll()).resolves.toEqual(result);
      expect(mockStorageEquipUserService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao listar relações');
      mockStorageEquipUserService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toBe(error);
    });
  });

  describe('findOne', () => {
    it('deve buscar uma relação pelo id', async () => {
      mockStorageEquipUserService.findOne.mockResolvedValue(relation);

      await expect(controller.findOne(1)).resolves.toEqual(relation);
      expect(mockStorageEquipUserService.findOne).toHaveBeenCalledWith(1);
    });

    it('deve retornar null quando a relação não existir', async () => {
      mockStorageEquipUserService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(999)).resolves.toBeNull();
      expect(mockStorageEquipUserService.findOne).toHaveBeenCalledWith(999);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao buscar relação');
      mockStorageEquipUserService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toBe(error);
    });
  });

  describe('update', () => {
    const dto: UpdateStorageEquipUserDto = { id_storage: 4 };

    it('deve delegar a atualização ao service com o id numérico', async () => {
      const updated = { ...relation, id_storage: 4 };
      mockStorageEquipUserService.update.mockResolvedValue(updated);

      await expect(controller.update(1, dto)).resolves.toEqual(updated);
      expect(mockStorageEquipUserService.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao atualizar relação');
      mockStorageEquipUserService.update.mockRejectedValue(error);

      await expect(controller.update(1, dto)).rejects.toBe(error);
    });
  });

  describe('remove', () => {
    it('deve delegar a remoção ao service e retornar o resultado', async () => {
      mockStorageEquipUserService.remove.mockResolvedValue(relation);

      await expect(controller.remove(1)).resolves.toEqual(relation);
      expect(mockStorageEquipUserService.remove).toHaveBeenCalledWith(1);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao remover relação');
      mockStorageEquipUserService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toBe(error);
    });
  });
});
