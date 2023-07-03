/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class GoogleUserDto {
  @ApiProperty({ example: 'Petro', description: 'User first name' })
  readonly firstName: string;

  @ApiProperty({ example: 'Poroshenko', description: 'User last name' })
  readonly lastName: string;

  @ApiProperty({ example: 'poroshenko@gmail.com', description: 'User email' })
  readonly email: string;

  @ApiProperty({ example: 'Petro-123545', description: 'User password' })
  readonly password: string;

  @ApiProperty({ example: 'https://', description: 'User avatar' })
  readonly avatarURL: string;

  @ApiProperty({
    example: 'I1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzN',
    description: 'Google ID',
  })
  readonly googleId: string;
}
