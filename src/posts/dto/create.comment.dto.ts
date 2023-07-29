/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  id: string;
  @ApiProperty({
    example: 'Change my item for your item',
    description: 'Comment description',
  })
  readonly text: string;
  user: object;
  answer: Array<object>;
}
