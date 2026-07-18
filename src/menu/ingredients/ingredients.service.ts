import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIngredientDto } from '../ingredients/ingredientDto.dto';
import { UpdateIngredientDto } from '../ingredients/updateIngredient.Dto';
import { UpdateIngredientAvailabilityDto } from '../ingredients/updateIngredientAvailability.Dto';

@Injectable()
export class IngredientsService {
  constructor(private prisma: PrismaService) {}

  /////////////////////////////////////////////////////
  // CRIAR INGREDIENTE
  /////////////////////////////////////////////////////

  async criarIngrediente(dto: CreateIngredientDto) {
    const ingredienteExists = await this.prisma.ingredient.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (ingredienteExists) {
      throw new ConflictException('Ingrediente já cadastrado.');
    }

    const ingrediente = await this.prisma.ingredient.create({
      data: dto,
    });

    return ingrediente;
  }

  /////////////////////////////////////////////////////
  // BUSCAR POR ID
  /////////////////////////////////////////////////////

  async buscarIngredienteById(id: string) {
    const ingrediente = await this.prisma.ingredient.findUnique({
      where: {
        id,
      },
    });

    if (!ingrediente) {
      throw new NotFoundException('Ingrediente não encontrado.');
    }

    return ingrediente;
  }

  /////////////////////////////////////////////////////
  // LISTAR TODOS
  /////////////////////////////////////////////////////

  async listarIngredientes() {
    return await this.prisma.ingredient.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /////////////////////////////////////////////////////
  // ATUALIZAR
  /////////////////////////////////////////////////////

  async atualizarIngrediente(
    id: string,
    dto: UpdateIngredientDto,
  ) {
    await this.buscarIngredienteById(id);

    if (dto.name) {
      const ingredienteExists = await this.prisma.ingredient.findFirst({
        where: {
          name: dto.name,
          NOT: {
            id,
          },
        },
      });

      if (ingredienteExists) {
        throw new ConflictException(
          'Já existe outro ingrediente com esse nome.',
        );
      }
    }

    return await this.prisma.ingredient.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  /////////////////////////////////////////////////////
  // ALTERAR DISPONIBILIDADE
  /////////////////////////////////////////////////////

  async alterarDisponibilidade(
    id: string,
    dto: UpdateIngredientAvailabilityDto,
  ) {
    await this.buscarIngredienteById(id);

    return await this.prisma.ingredient.update({
      where: {
        id,
      },
      data: {
        available: dto.available,
      },
    });
  }
}