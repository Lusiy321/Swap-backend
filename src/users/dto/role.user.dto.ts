/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

enum role {
  admin = 'admin',
  user = 'user',
  boss = 'moderator',
}

export class RoleUserDto {
  @ApiProperty({ example: 'moderator', description: 'User role' })
  readonly role: role;
}
