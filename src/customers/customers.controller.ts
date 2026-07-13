import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './CreateCostumer.dto';
import { UpdateCustomerDto } from './customerUpdate.dto';

@Controller('customers')
export class CustomersController {
    constructor(
        private customerService : CustomersService
    ){}


//cadastrar clientes
@Post('cadastrar')
async createCliente(@Body() cadastroClienteDto : CreateCustomerDto){
    
    const cliente  = await this.customerService.cadastrarCliente(cadastroClienteDto)

    return {
        message : "cliente cadastrado com sucesso",
        data : cliente
    }

}

//filtrar por telefone 
@Get(':telefone')
async filtrarTelefone(@Param('telefone') telefone : string){

    const cliente = await this.customerService.IdentificarPorTel(telefone)

    return {
        message : "cliente retornado ocm sucesso",
        data : cliente
    }
     
}

//exibir todos clientes 
@Get()
async getAll(){
    
    const clientes = await this.customerService.todosClientes()

    return { 
        message : 'clientes retornados com sucesso',
        data : clientes
    }
}


//atualizar cadastro do cliente 
@Patch(':telefone')
async atualizarCliente(@Param('telefone') idCliente : string,
@Body() clienteUpdateDto : UpdateCustomerDto){

    const clienteAtualizado = await this.customerService.atualizaCliente(clienteUpdateDto, idCliente)

    return {
        message : 'cliente atualizado com sucesso',
        data : clienteAtualizado
    }

}

}
