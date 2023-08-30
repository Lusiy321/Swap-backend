/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import * as categoriesData from './category.json';

interface categoryList {
  [key: string]: string;
}
const categoryList: Record<string, string> = categoriesData;

export const categoriesArray = Object.values(categoryList);

export class CategoryPostDto {
  @ApiProperty({
    example: 'electronics',
    description: 'Post category',
  })
  readonly category: categoryList;
}
