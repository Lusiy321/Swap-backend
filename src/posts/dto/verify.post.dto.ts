/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export enum verify {
  new = 'new',
  aprove = 'approve',
  rejected = 'rejected',
}

export class VerifyPostDto {
  @ApiProperty({
    example: 'approve',
    description: 'Post verify',
  })
  readonly verify: verify;
}
