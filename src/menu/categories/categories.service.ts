import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from '../categories/create-category.dto';
import { UpdateCategoryDto } from '../categories/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /////////////////////////////////////////////////////
  // CRIAR CATEGORIA
  /////////////////////////////////////////////////////

  async criarCategoria(dto: CreateCategoryDto) {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (categoryExists) {
      throw new ConflictException('Categoria já cadastrada.');
    }

    return await this.prisma.category.create({
      data: dto,
    });
  }

  /////////////////////////////////////////////////////
  // BUSCAR POR ID
  /////////////////////////////////////////////////////

  async buscarCategoriaById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    return category;
  }

  /////////////////////////////////////////////////////
  // LISTAR TODAS
  /////////////////////////////////////////////////////

  async listarCategorias() {
    return await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /////////////////////////////////////////////////////
  // ATUALIZAR
  /////////////////////////////////////////////////////

  async atualizarCategoria(
    id: string,
    dto: UpdateCategoryDto,
  ) {
    await this.buscarCategoriaById(id);

    if (dto.name) {
      const exists = await this.prisma.category.findFirst({
        where: {
          name: dto.name,
          NOT: {
            id,
          },
        },
      });

      if (exists) {
        throw new ConflictException(
          'Já existe uma categoria com esse nome.',
        );
      }
    }

    return await this.prisma.category.update({
      where: {
        id,
      },
      data: dto,
    });
  }
}