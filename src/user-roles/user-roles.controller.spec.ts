import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

describe('UserRolesController', () => {
  let controller: UserRolesController;

  const mockUserRolesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRolesController],
      providers: [
        { provide: UserRolesService, useValue: mockUserRolesService },
      ],
    }).compile();

    controller = module.get<UserRolesController>(UserRolesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserRoleDto: CreateUserRoleDto = { id_user: 1, id_roles: 2 };

    it('deve criar uma associação de usuário e role com sucesso', async () => {
      const createdUserRole = { id: 1, ...createUserRoleDto };
      mockUserRolesService.create.mockResolvedValue(createdUserRole);

      await expect(controller.create(createUserRoleDto)).resolves.toEqual(
        createdUserRole,
      );
      expect(mockUserRolesService.create).toHaveBeenCalledWith(
        createUserRoleDto,
      );
    });

    it('deve repassar erro quando usuário ou role não forem encontrados', async () => {
      mockUserRolesService.create.mockRejectedValue(
        new NotFoundException('Usuário não encontrado.'),
      );

      await expect(controller.create(createUserRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve repassar erro inesperado do service', async () => {
      mockUserRolesService.create.mockRejectedValue(
        new InternalServerErrorException('Erro ao criar associação'),
      );

      await expect(controller.create(createUserRoleDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar a listagem paginada', async () => {
      const result = {
        dados: [{ id: 1, id_user: 1, id_roles: 2 }],
        pagina: 1,
        limite: 10,
        total: 1,
        totalPaginas: 1,
      };
      mockUserRolesService.findAll.mockResolvedValue(result);

      await expect(controller.findAll()).resolves.toEqual(result);
      expect(mockUserRolesService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve repassar erro do service', async () => {
      mockUserRolesService.findAll.mockRejectedValue(
        new InternalServerErrorException('Erro ao listar associações'),
      );

      await expect(controller.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('deve buscar uma associação pelo id', async () => {
      const userRole = { id: 1, id_user: 1, id_roles: 2 };
      mockUserRolesService.findOne.mockResolvedValue(userRole);

      await expect(controller.findOne(1)).resolves.toEqual(userRole);
      expect(mockUserRolesService.findOne).toHaveBeenCalledWith(1);
    });

    it('deve repassar erro quando a associação não for encontrada', async () => {
      mockUserRolesService.findOne.mockRejectedValue(
        new NotFoundException('Associação não encontrada'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockUserRolesService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    const updateUserRoleDto: UpdateUserRoleDto = { id_roles: 3 };

    it('deve atualizar uma associação', async () => {
      const updatedUserRole = { id: 1, id_user: 1, id_roles: 3 };
      mockUserRolesService.update.mockResolvedValue(updatedUserRole);

      await expect(controller.update(1, updateUserRoleDto)).resolves.toEqual(
        updatedUserRole,
      );
      expect(mockUserRolesService.update).toHaveBeenCalledWith(
        1,
        updateUserRoleDto,
      );
    });

    it('deve repassar erro do service ao atualizar', async () => {
      mockUserRolesService.update.mockRejectedValue(
        new NotFoundException('Associação não encontrada'),
      );

      await expect(controller.update(999, updateUserRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover uma associação', async () => {
      const deletedUserRole = { id: 1, id_user: 1, id_roles: 2 };
      mockUserRolesService.remove.mockResolvedValue(deletedUserRole);

      await expect(controller.remove(1)).resolves.toEqual(deletedUserRole);
      expect(mockUserRolesService.remove).toHaveBeenCalledWith(1);
    });

    it('deve repassar erro do service ao remover', async () => {
      mockUserRolesService.remove.mockRejectedValue(
        new NotFoundException('Associação não encontrada'),
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
