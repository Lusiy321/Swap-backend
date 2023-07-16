/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CommentUserDto {
  @ApiProperty({ example: 'Petro', description: 'User first name' })
  readonly firstName: string;
  @ApiProperty({ example: 'Poroshenko', description: 'User last name' })
  readonly lastName: string;
  @ApiProperty({ example: 'https://', description: 'User avatar' })
  readonly avatarURL: string;
  @ApiProperty({ example: 'false', description: 'User status' })
  readonly isOnline: boolean;
}
