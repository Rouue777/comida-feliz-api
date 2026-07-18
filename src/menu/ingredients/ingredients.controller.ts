import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from '../ingredients/ingredientDto.dto';
import { UpdateIngredientDto } from '../ingredients/updateIngredient.Dto';
import { UpdateIngredientAvailabilityDto } from '../ingredients/updateIngredientAvailability.Dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly ingredientsService: IngredientsService,
  ) {}

  /////////////////////////////////////////////////////
  // CRIAR INGREDIENTE
  /////////////////////////////////////////////////////

  @Post()
  async criarIngrediente(
    @Body() dto: CreateIngredientDto,
  ) {
    const ingrediente =
      await this.ingredientsService.criarIngrediente(dto);

    return {
      message: 'Ingrediente cadastrado com sucesso.',
      data: ingrediente,
    };
  }

  /////////////////////////////////////////////////////
  // BUSCAR POR ID
  /////////////////////////////////////////////////////

  @Get(':id')
  async buscarIngredienteById(
    @Param('id') id: string,
  ) {
    const ingrediente =
      await this.ingredientsService.buscarIngredienteById(id);

    return {
      message: 'Ingrediente encontrado com sucesso.',
      data: ingrediente,
    };
  }

  /////////////////////////////////////////////////////
  // LISTAR TODOS
  /////////////////////////////////////////////////////

  @Get()
  async listarIngredientes() {
    const ingredientes =
      await this.ingredientsService.listarIngredientes();

    return {
      message: 'Ingredientes listados com sucesso.',
      data: ingredientes,
    };
  }

  /////////////////////////////////////////////////////
  // ATUALIZAR
  /////////////////////////////////////////////////////

  @Patch(':id')
  async atualizarIngrediente(
    @Param('id') id: string,
    @Body() dto: UpdateIngredientDto,
  ) {
    const ingrediente =
      await this.ingredientsService.atualizarIngrediente(
        id,
        dto,
      );

    return {
      message: 'Ingrediente atualizado com sucesso.',
      data: ingrediente,
    };
  }

  /////////////////////////////////////////////////////
  // ALTERAR DISPONIBILIDADE
  /////////////////////////////////////////////////////

  @Patch(':id/availability')
  async alterarDisponibilidade(
    @Param('id') id: string,
    @Body() dto: UpdateIngredientAvailabilityDto,
  ) {
    const ingrediente =
      await this.ingredientsService.alterarDisponibilidade(
        id,
        dto,
      );

    return {
      message: 'Disponibilidade alterada com sucesso.',
      data: ingrediente,
    };
  }
}