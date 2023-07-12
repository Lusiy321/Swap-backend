/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export enum verify {
  new = 'new',
  aprove = 'aprove',
  rejected = 'rejected',
}

export class VerifyPostDto {
  @ApiProperty({
    example: 'new, aprove or rejected',
    description: 'Post verify',
  })
  readonly verify: verify;
}
