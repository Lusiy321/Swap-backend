/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My first post', description: 'Post title' })
  readonly title: string;

  @ApiProperty({ example: 'Kyiv', description: 'User location' })
  readonly location: string;

  @ApiProperty({
    example: 'Change my item for your item',
    description: 'Post description',
  })
  readonly description: string;

  @ApiProperty({
    example:
      'https://ldsound.info/wp-content/uploads/2013/07/25%D0%B0%D1%81128-ldsound_ru-1.jpg',
    description: 'Post image',
  })
  readonly img: string;
}
