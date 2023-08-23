/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export enum categoryList {
  other = 'other',
  cloth = 'cloth',
  electronics = 'electronics',
  health = 'health',
  house = 'house',
  sport = 'sport',
  children = 'children',
  animals = 'animals',
  books = 'books',
  auto = 'auto',
  food = 'food',
  craft = 'craft',
  souvenirs = 'souvenirs',
  garden = 'garden',
  collecting = 'collecting',
}

export class CategoryPostDto {
  @ApiProperty({
    example: 'electronics',
    description: 'Post category',
  })
  readonly category: categoryList;
}
