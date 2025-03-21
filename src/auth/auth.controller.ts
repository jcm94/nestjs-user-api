import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ApiTags, ApiOperation,ApiResponse } from '@nestjs/swagger';
import { UserDocument } from 'src/users/schemas/user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registro de usuario' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const user = await this.authService.register(registerDto);
    res.status(HttpStatus.CREATED).json(user);
  }

  @ApiOperation({ summary: 'Inicio de sesión'})
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const token = await this.authService.login(loginDto);
    res.cookie('jwt', token, { httpOnly: true });
    res.json({ message: 'Inicio de sesión exitoso'});
  }
}
