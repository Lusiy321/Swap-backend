/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export enum category {
  none = 'none',
  cloth = 'cloth',
  electronics = 'electronics',
}

export class CategoryPostDto {
  @ApiProperty({
    example: 'electronics',
    description: 'Post category',
  })
  readonly category: category;
}
