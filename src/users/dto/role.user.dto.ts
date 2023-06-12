/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

enum role {
  admin = 'admin',
  user = 'user',
  boss = 'boss',
}

export class RoleUserDto {
  @ApiProperty({ example: 'boss', description: 'User role' })
  readonly role: role;
}
