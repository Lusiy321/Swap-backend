/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export enum verify {
  new = 'new',
  aprove = 'aprove',
  rejected = 'rejected',
}

export class CreatePostDto {
  @ApiProperty({ example: 'new, aprove, rejected', description: 'Post verify' })
  readonly verify: verify;
}
