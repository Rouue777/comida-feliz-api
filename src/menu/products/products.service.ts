import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from'../products/create-product.dto';
import { UpdateProductDto } from '../products/update-product.dto';
import { UpdateProductAvailabilityDto } from '../products/update-product-availability.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /////////////////////////////////////////////////////
  // CRIAR PRODUTO
  /////////////////////////////////////////////////////

  async criarProduto(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: dto.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const productExists = await this.prisma.product.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (productExists) {
      throw new ConflictException('Produto já cadastrado.');
    }

    return await this.prisma.product.create({
      data: {
        ...dto,
      },
    });
  }

  /////////////////////////////////////////////////////
  // BUSCAR POR ID
  /////////////////////////////////////////////////////

  async buscarProdutoById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }

  /////////////////////////////////////////////////////
  // LISTAR PRODUTOS
  /////////////////////////////////////////////////////

  async listarProdutos() {
    return await this.prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /////////////////////////////////////////////////////
  // ATUALIZAR PRODUTO
  /////////////////////////////////////////////////////

  async atualizarProduto(
    id: string,
    dto: UpdateProductDto,
  ) {
    await this.buscarProdutoById(id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: dto.categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException('Categoria não encontrada.');
      }
    }

    if (dto.name) {
      const exists = await this.prisma.product.findFirst({
        where: {
          name: dto.name,
          NOT: {
            id,
          },
        },
      });

      if (exists) {
        throw new ConflictException(
          'Já existe outro produto com esse nome.',
        );
      }
    }

    return await this.prisma.product.update({
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
    dto: UpdateProductAvailabilityDto,
  ) {
    await this.buscarProdutoById(id);

    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        available: dto.available,
      },
    });
  }
}