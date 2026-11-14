import { Test, TestingModule } from '@nestjs/testing';
import { EquipamentController } from './equipament.controller';
import { EquipamentService } from './equipament.service';
import { CreateEquipamentDto } from './dto/create-equipament.dto';
import { UpdateEquipamentDto } from './dto/update-equipament.dto';

describe('EquipamentController', () => {
  let controller: EquipamentController;

  const mockEquipamentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipamentController],
      providers: [
        { provide: EquipamentService, useValue: mockEquipamentService },
      ],
    }).compile();

    controller = module.get<EquipamentController>(EquipamentController);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateEquipamentDto = {
      name: 'Câmera',
      code: 'CAM-001',
      description: 'Câmera de segurança',
      active: true,
    };

    it('deve delegar a criação ao service e retornar o resultado', async () => {
      const created = { id: 1, ...dto };
      mockEquipamentService.create.mockResolvedValue(created);

      await expect(controller.create(dto)).resolves.toEqual(created);
      expect(mockEquipamentService.create).toHaveBeenCalledWith(dto);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao criar equipamento');
      mockEquipamentService.create.mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toBe(error);
    });
  });

  describe('findAll', () => {
    it('deve delegar a listagem ao service e retornar o resultado', async () => {
      const result = {
        dados: [
          {
            id: 1,
            name: 'Câmera',
            code: 'CAM-001',
            description: 'Câmera de segurança',
            active: true,
          },
        ],
        pagina: 1,
        limite: 10,
        total: 1,
        totalPaginas: 1,
      };
      mockEquipamentService.findAll.mockResolvedValue(result);

      await expect(controller.findAll()).resolves.toEqual(result);
      expect(mockEquipamentService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao listar equipamentos');
      mockEquipamentService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toBe(error);
    });
  });

  describe('findOne', () => {
    it('deve buscar o equipamento pelo id', async () => {
      const equipament = {
        id: 1,
        name: 'Câmera',
        code: 'CAM-001',
        description: 'Câmera de segurança',
        active: true,
      };
      mockEquipamentService.findOne.mockResolvedValue(equipament);

      await expect(controller.findOne(1)).resolves.toEqual(equipament);
      expect(mockEquipamentService.findOne).toHaveBeenCalledWith(1);
    });

    it('deve retornar null quando o equipamento não existir', async () => {
      mockEquipamentService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(999)).resolves.toBeNull();
      expect(mockEquipamentService.findOne).toHaveBeenCalledWith(999);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao buscar equipamento');
      mockEquipamentService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toBe(error);
    });
  });

  describe('update', () => {
    const dto: UpdateEquipamentDto = { name: 'Câmera atualizada' };

    it('deve delegar a atualização ao service', async () => {
      const updated = {
        id: 1,
        name: 'Câmera atualizada',
        code: 'CAM-001',
        description: 'Câmera de segurança',
        active: true,
      };
      mockEquipamentService.update.mockResolvedValue(updated);

      await expect(controller.update(1, dto)).resolves.toEqual(updated);
      expect(mockEquipamentService.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao atualizar equipamento');
      mockEquipamentService.update.mockRejectedValue(error);

      await expect(controller.update(1, dto)).rejects.toBe(error);
    });
  });

  describe('remove', () => {
    it('deve converter o id para número e delegar a remoção ao service', async () => {
      const removed = {
        id: 1,
        name: 'Câmera',
        code: 'CAM-001',
        description: 'Câmera de segurança',
        active: true,
      };
      mockEquipamentService.remove.mockResolvedValue(removed);

      await expect(controller.remove('1')).resolves.toEqual(removed);
      expect(mockEquipamentService.remove).toHaveBeenCalledWith(1);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao remover equipamento');
      mockEquipamentService.remove.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toBe(error);
    });
  });
});
