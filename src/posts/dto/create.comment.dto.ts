/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  id: string;

  @ApiProperty({ example: '64aee11adad509ad58f4f37d', description: 'User ID' })
  readonly user: string;

  @ApiProperty({ example: 'Petro', description: 'User first name' })
  readonly firstName: string;

  @ApiProperty({ example: 'Poroshenko', description: 'User last name' })
  readonly lastName: string;

  @ApiProperty({
    example: 'Change my item for your item',
    description: 'Comment description',
  })
  readonly text: string;
}
