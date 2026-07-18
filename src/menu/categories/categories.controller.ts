import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '../categories/create-category.dto';
import { UpdateCategoryDto } from '../categories/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  /////////////////////////////////////////////////////
  // CRIAR CATEGORIA
  /////////////////////////////////////////////////////

  @Post()
  async criarCategoria(
    @Body() dto: CreateCategoryDto,
  ) {
    const category =
      await this.categoriesService.criarCategoria(dto);

    return {
      message: 'Categoria cadastrada com sucesso.',
      data: category,
    };
  }

  /////////////////////////////////////////////////////
  // BUSCAR POR ID
  /////////////////////////////////////////////////////

  @Get(':id')
  async buscarCategoriaById(
    @Param('id') id: string,
  ) {
    const category =
      await this.categoriesService.buscarCategoriaById(id);

    return {
      message: 'Categoria encontrada com sucesso.',
      data: category,
    };
  }

  /////////////////////////////////////////////////////
  // LISTAR TODAS
  /////////////////////////////////////////////////////

  @Get()
  async listarCategorias() {
    const categories =
      await this.categoriesService.listarCategorias();

    return {
      message: 'Categorias listadas com sucesso.',
      data: categories,
    };
  }

  /////////////////////////////////////////////////////
  // ATUALIZAR
  /////////////////////////////////////////////////////

  @Patch(':id')
  async atualizarCategoria(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    const category =
      await this.categoriesService.atualizarCategoria(
        id,
        dto,
      );

    return {
      message: 'Categoria atualizada com sucesso.',
      data: category,
    };
  }
}