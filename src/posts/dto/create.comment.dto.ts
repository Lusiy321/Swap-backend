/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { CommentUserDto } from 'src/users/dto/comments.user.dto';

export class CreateCommentDto {
  id: string;

  user: CommentUserDto;

  @ApiProperty({
    example: 'Change my item for your item',
    description: 'Comment description',
  })
  readonly text: string;

  answer: Array<object>;
}
