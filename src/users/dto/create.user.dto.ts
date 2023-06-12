/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'poroshenko@gmail.com', description: 'User email' })
  readonly email: string;

  @ApiProperty({ example: 'Petro-123545', description: 'User password' })
  readonly password: string;
}
