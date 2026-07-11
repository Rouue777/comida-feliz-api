import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { ValidationPipe } from '@nestjs/common';

@Injectable()
export class AuthService {

    //importando dependencias
    constructor(private  prisma : PrismaService,
        private  jwtService : JwtService
    ){       
    }


    //metodo login
async login(loginDto : LoginDto){




    const user = await this.prisma.user.findUnique({
        where : {
            email : loginDto.email
        }
    })

    if (!user){
        throw new ForbiddenException('usuario não existe')
    }

    const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
    )

    if (!isPasswordValid) {
    throw new ForbiddenException('Senha inválida');
}

    //Criando payload
    const payload = {
        name : user.name,
        sub : user.id,
        email : user.email,
        role : user.role,
    }

    const acessToken = await this.jwtService.signAsync(payload);
    
    return { 
        message : 'token gerado com sucesso',
        access_token : acessToken,
    }


}








}



