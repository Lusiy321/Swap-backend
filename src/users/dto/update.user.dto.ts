/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Petro', description: 'User name' })
  readonly name: string;
  @ApiProperty({ example: 'poroshenko@gmail.com', description: 'User email' })
  readonly email: string;
  @ApiProperty({ example: 'Petro-123545', description: 'User password' })
  readonly password: string;
}
