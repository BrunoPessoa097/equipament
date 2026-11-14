import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      password: 'Senha@123',
      active: true,
    };

    it('deve criar um usuário com sucesso', async () => {
      const mockCreatedUser = {
        id: 1,
        name: createUserDto.name,
        email: createUserDto.email,
        active: createUserDto.active,
      };

      mockUserService.create.mockResolvedValue(mockCreatedUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('deve repassar erro de conflito quando o service falhar por duplicidade', async () => {
      const conflictError = new ConflictException(
        'Já existe um usuário com esses dados.',
      );
      mockUserService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
    });

    it('deve repassar erro inesperado quando o service falhar', async () => {
      const dbError = new InternalServerErrorException(
        'Erro no banco de dados',
      );
      mockUserService.create.mockRejectedValue(dbError);

      await expect(controller.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve retornar a listagem de usuários com sucesso', async () => {
      const mockResult = {
        dados: [
          {
            id: 1,
            name: 'João Silva',
            email: 'joao.silva@example.com',
            active: true,
          },
        ],
        pagina: 1,
        limite: 10,
        total: 1,
        totalPaginas: 1,
      };

      mockUserService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não houver usuários cadastrados', async () => {
      const mockEmptyResult = {
        dados: [],
        pagina: 1,
        limite: 10,
        total: 0,
        totalPaginas: 0,
      };

      mockUserService.findAll.mockResolvedValue(mockEmptyResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockEmptyResult);
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve repassar erro quando o service falhar ao buscar a listagem', async () => {
      const dbError = new InternalServerErrorException('Erro ao listar');
      mockUserService.findAll.mockRejectedValue(dbError);

      await expect(controller.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve buscar um usuário pelo id com sucesso', async () => {
      const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao.silva@example.com',
        active: true,
      };

      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });

    it('deve retornar null quando o usuário não for encontrado', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith(999);
    });

    it('deve repassar erro quando o service falhar ao buscar pelo id', async () => {
      const dbError = new InternalServerErrorException(
        'Erro ao buscar usuário',
      );
      mockUserService.findOne.mockRejectedValue(dbError);

      await expect(controller.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'João Silva Atualizado',
    };

    it('deve atualizar um usuário com sucesso', async () => {
      const mockUpdatedUser = {
        id: 1,
        name: 'João Silva Atualizado',
        email: 'joao.silva@example.com',
        active: true,
      };

      mockUserService.update.mockResolvedValue(mockUpdatedUser);

      const result = await controller.update(1, updateUserDto);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockUserService.update).toHaveBeenCalledTimes(1);
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('deve repassar erro quando o registro a ser atualizado não for encontrado', async () => {
      const notFoundError = new NotFoundException('Usuário não encontrado');
      mockUserService.update.mockRejectedValue(notFoundError);

      await expect(controller.update(999, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserService.update).toHaveBeenCalledTimes(1);
      expect(mockUserService.update).toHaveBeenCalledWith(999, updateUserDto);
    });

    it('deve repassar erro quando o service falhar por duplicidade ao atualizar', async () => {
      const conflictError = new ConflictException('Email já em uso');
      mockUserService.update.mockRejectedValue(conflictError);

      await expect(controller.update(1, updateUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve remover um usuário com sucesso', async () => {
      const mockDeletedUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao.silva@example.com',
        active: true,
      };

      mockUserService.remove.mockResolvedValue(mockDeletedUser);

      const result = await controller.remove(1 as unknown as string);

      expect(result).toEqual(mockDeletedUser);
      expect(mockUserService.remove).toHaveBeenCalledTimes(1);
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
    });

    it('deve repassar erro quando o usuário a ser removido não existir', async () => {
      const notFoundError = new NotFoundException('Usuário não encontrado');
      mockUserService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove(999 as unknown as string)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserService.remove).toHaveBeenCalledTimes(1);
      expect(mockUserService.remove).toHaveBeenCalledWith(999);
    });

    it('deve repassar erro inesperado quando o service falhar ao remover', async () => {
      const dbError = new InternalServerErrorException('Erro ao remover');
      mockUserService.remove.mockRejectedValue(dbError);

      await expect(controller.remove(1 as unknown as string)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUserService.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      password: 'Senha@123',
      active: true,
    };

    it('deve criar um usuário com sucesso', async () => {
      const mockCreatedUser = {
        id: 1,
        name: createUserDto.name,
        email: createUserDto.email,
        active: createUserDto.active,
      };

      mockUserService.create.mockResolvedValue(mockCreatedUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('deve repassar erro de conflito quando o service falhar por duplicidade', async () => {
      const conflictError = new ConflictException(
        'Já existe um usuário com esses dados.',
      );
      mockUserService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
    });

    it('deve repassar erro inesperado quando o service falhar', async () => {
      const dbError = new InternalServerErrorException(
        'Erro no banco de dados',
      );
      mockUserService.create.mockRejectedValue(dbError);

      await expect(controller.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve retornar a listagem de usuários com sucesso', async () => {
      const mockResult = {
        dados: [
          {
            id: 1,
            name: 'João Silva',
            email: 'joao.silva@example.com',
            active: true,
          },
        ],
        pagina: 1,
        limite: 10,
        total: 1,
        totalPaginas: 1,
      };

      mockUserService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não houver usuários cadastrados', async () => {
      const mockEmptyResult = {
        dados: [],
        pagina: 1,
        limite: 10,
        total: 0,
        totalPaginas: 0,
      };

      mockUserService.findAll.mockResolvedValue(mockEmptyResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockEmptyResult);
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve repassar erro quando o service falhar ao buscar a listagem', async () => {
      const dbError = new InternalServerErrorException('Erro ao listar');
      mockUserService.findAll.mockRejectedValue(dbError);

      await expect(controller.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve buscar um usuário pelo id com sucesso', async () => {
      const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao.silva@example.com',
        active: true,
      };

      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });

    it('deve retornar null quando o usuário não for encontrado', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith(999);
    });

    it('deve repassar erro quando o service falhar ao buscar pelo id', async () => {
      const dbError = new InternalServerErrorException(
        'Erro ao buscar usuário',
      );
      mockUserService.findOne.mockRejectedValue(dbError);

      await expect(controller.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'João Silva Atualizado',
    };

    it('deve atualizar um usuário com sucesso', async () => {
      const mockUpdatedUser = {
        id: 1,
        name: 'João Silva Atualizado',
        email: 'joao.silva@example.com',
        active: true,
      };

      mockUserService.update.mockResolvedValue(mockUpdatedUser);

      const result = await controller.update(1, updateUserDto);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockUserService.update).toHaveBeenCalledTimes(1);
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('deve repassar erro quando o registro a ser atualizado não for encontrado', async () => {
      const notFoundError = new NotFoundException('Usuário não encontrado');
      mockUserService.update.mockRejectedValue(notFoundError);

      await expect(controller.update(999, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserService.update).toHaveBeenCalledTimes(1);
      expect(mockUserService.update).toHaveBeenCalledWith(999, updateUserDto);
    });

    it('deve repassar erro quando o service falhar por duplicidade ao atualizar', async () => {
      const conflictError = new ConflictException('Email já em uso');
      mockUserService.update.mockRejectedValue(conflictError);

      await expect(controller.update(1, updateUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve remover um usuário com sucesso', async () => {
      const mockDeletedUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao.silva@example.com',
        active: true,
      };

      mockUserService.remove.mockResolvedValue(mockDeletedUser);

      const result = await controller.remove(1 as unknown as string);

      expect(result).toEqual(mockDeletedUser);
      expect(mockUserService.remove).toHaveBeenCalledTimes(1);
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
    });

    it('deve repassar erro quando o usuário a ser removido não existir', async () => {
      const notFoundError = new NotFoundException('Usuário não encontrado');
      mockUserService.remove.mockRejectedValue(notFoundError);

      await expect(
        controller.remove(999 as unknown as string),
      ).rejects.toThrow(NotFoundException);
      expect(mockUserService.remove).toHaveBeenCalledTimes(1);
      expect(mockUserService.remove).toHaveBeenCalledWith(999);
    });

    it('deve repassar erro inesperado quando o service falhar ao remover', async () => {
      const dbError = new InternalServerErrorException('Erro ao remover');
      mockUserService.remove.mockRejectedValue(dbError);

      await expect(
        controller.remove(1 as unknown as string),
      ).rejects.toThrow(InternalServerErrorException);
      expect(mockUserService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
