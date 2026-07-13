import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './CreateCostumer.dto';
import { UpdateCustomerDto } from './customerUpdate.dto';

@Injectable()
export class CustomersService {
    
    constructor(private prisma : PrismaService){
    }


    ////////cadastrar cliente 
async cadastrarCliente( CadastroClienteDto : CreateCustomerDto){
    
    //checar se ja existe

    const Cliente = await this.prisma.customer.findUnique({
        where : {
            phone : CadastroClienteDto.phone
        }
    })


    if(Cliente){
        throw new ConflictException('esse numero já esta cadastrado como cliente')
    }

    const ClienteCriado = await this.prisma.customer.create({

        data : CadastroClienteDto,

    })


    return  ClienteCriado


}


//////////exibir  cliente pelo numero
async IdentificarPorTel(tel : string){

    const ClienteExists = await this.prisma.customer.findUnique({
        where : {
            phone : tel
        }
    })

    if(!ClienteExists){
      throw new NotFoundException('você precisa cadastrar esse cliente com numero para poder criar o pedido')
    }



    return ClienteExists


}

// listar todos os clientes
async todosClientes() {

    const clientes = await this.prisma.customer.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return clientes;
}

////atualizar cliente
async atualizaCliente(clienteDto : UpdateCustomerDto, idCliente : string){

    const ClienteExists = await this.prisma.customer.findUnique({
        where : {
            phone : idCliente
        }
    })

    if(!ClienteExists){
        throw new NotFoundException('Cliente não existe logo não pode ser alterado')
    }

    //atualizar cliente
    const cliente = await this.prisma.customer.update({
        where : {
            phone : idCliente,
        },
        data : clienteDto
    })

    return cliente

}



}
