import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './CreateCostumer.dto';

@Injectable()
export class CustomersService {
    
    constructor(private prisma : PrismaService){
    }


    //cadastrar cliente 
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


//identificar cliente pelo numero
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


}
