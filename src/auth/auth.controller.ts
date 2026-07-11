import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt.auth.guard';

@Controller('auth')
export class AuthController {
    //importando dependencias
    constructor(private authService : AuthService){

    }


@Post('login')
login(@Body() logindto : LoginDto){
   return this.authService.login(logindto)
}

@UseGuards(JwtAuthGuard)
@Get('teste')
teste(){}

}
