/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/users/dto/update.user.dto';

export class CreateMessageDto {
  id: string;
  @ApiProperty({
    example: 'Change my item for your item',
    description: 'Message description',
  })
  readonly text: string;
  user: UpdateUserDto;
  time: number;
}
