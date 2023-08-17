/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class PasswordUserDto {
  @ApiProperty({ example: 'Petro-123545', description: 'User password' })
  readonly oldPassword: string;
  @ApiProperty({ example: 'Petro-123545', description: 'User password' })
  readonly password: string;
}
