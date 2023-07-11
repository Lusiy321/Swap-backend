/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export enum role {
  admin = 'admin',
  user = 'user',
  moderator = 'moderator',
}

export class RoleUserDto {
  @ApiProperty({ example: 'moderator', description: 'User role' })
  readonly role: role;
}


