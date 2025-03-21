import { Injectable, UnauthorizedException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SocketGateway } from '../socket/socket.gateway';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const user = await this.usersService.create(registerDto);

    // Emitir mensaje por Socket.IO
    this.socketGateway.sendOperationMessage(`El usuario ${user.email} realizo el registro`);
    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas 1');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas 2');
    }
    // Emitir mensaje por Socket.IO
    this.socketGateway.sendOperationMessage(`El usuario ${user.email} inició sesión`);
    const payload = { sub: (user as UserDocument).id, email: user.email }; 
    return this.jwtService.sign(payload);
  }
}
