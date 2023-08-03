/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateOredrDto {
  @ApiProperty({ example: 'Product card', description: 'Product for change' })
  readonly product: string;

  @ApiProperty({ example: 'Offer card', description: 'Product for change' })
  readonly offer: string;
}
