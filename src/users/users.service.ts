import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocketGateway } from '../socket/socket.gateway';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly socketGateway: SocketGateway,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({...createUserDto, password: hashedPassword });
    const user = await createdUser.save();
    this.socketGateway.sendOperationMessage(`El usuario ${user.email} fue creado`);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('name email').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('name email').exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    const updatedUser = await this.userModel.findByIdAndUpdate(id, {...updateUserDto, password: hashedPassword }, { new: true });
    if (!updatedUser) throw new NotFoundException('Usuario no encontrado');
    this.socketGateway.sendOperationMessage(`El usuario ${updatedUser.email} fue actualizado`);
    return updatedUser;
  }

  async remove(id: string): Promise<any> {
    const deletedUser = await this.userModel.findByIdAndRemove(id);
    if (!deletedUser) throw new NotFoundException('Usuario no encontrado');
    this.socketGateway.sendOperationMessage(`El usuario ${deletedUser.email} fue eliminado`);
    return { message: 'Usuario eliminado' };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
