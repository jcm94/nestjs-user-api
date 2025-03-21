import { ApiProperty, PartialType } from '@nestjs/swagger';


export class UpdateUserDto {
    @ApiProperty()
    readonly name!: string;
  
    @ApiProperty()
    readonly password!: string;
  }