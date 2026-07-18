import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../products/create-product.dto';
import { UpdateProductDto } from '../products/update-product.dto';
import { UpdateProductAvailabilityDto } from '../products/update-product-availability.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  /////////////////////////////////////////////////////
  // CRIAR PRODUTO
  /////////////////////////////////////////////////////

  @Post()
  async criarProduto(
    @Body() dto: CreateProductDto,
  ) {
    const product =
      await this.productsService.criarProduto(dto);

    return {
      message: 'Produto cadastrado com sucesso.',
      data: product,
    };
  }

  /////////////////////////////////////////////////////
  // BUSCAR POR ID
  /////////////////////////////////////////////////////

  @Get(':id')
  async buscarProdutoById(
    @Param('id') id: string,
  ) {
    const product =
      await this.productsService.buscarProdutoById(id);

    return {
      message: 'Produto encontrado com sucesso.',
      data: product,
    };
  }

  /////////////////////////////////////////////////////
  // LISTAR PRODUTOS
  /////////////////////////////////////////////////////

  @Get()
  async listarProdutos() {
    const products =
      await this.productsService.listarProdutos();

    return {
      message: 'Produtos listados com sucesso.',
      data: products,
    };
  }

  /////////////////////////////////////////////////////
  // ATUALIZAR PRODUTO
  /////////////////////////////////////////////////////

  @Patch(':id')
  async atualizarProduto(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const product =
      await this.productsService.atualizarProduto(
        id,
        dto,
      );

    return {
      message: 'Produto atualizado com sucesso.',
      data: product,
    };
  }

  /////////////////////////////////////////////////////
  // ALTERAR DISPONIBILIDADE
  /////////////////////////////////////////////////////

  @Patch(':id/availability')
  async alterarDisponibilidade(
    @Param('id') id: string,
    @Body() dto: UpdateProductAvailabilityDto,
  ) {
    const product =
      await this.productsService.alterarDisponibilidade(
        id,
        dto,
      );

    return {
      message: 'Disponibilidade alterada com sucesso.',
      data: product,
    };
  }
}