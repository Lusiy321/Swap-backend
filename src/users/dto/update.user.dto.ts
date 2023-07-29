/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'fksldflk88789dksfjl', description: 'User ID' })
  id: string;
  @ApiProperty({ example: 'Petro', description: 'User first name' })
  readonly firstName: string;
  @ApiProperty({ example: 'Poroshenko', description: 'User last name' })
  readonly lastName: string;
  @ApiProperty({ example: '+380984561225', description: 'User phone' })
  readonly phone: string;
  @ApiProperty({ example: 'Kyiv', description: 'User location' })
  readonly location: string;
  @ApiProperty({ example: 'https://', description: 'User avatar' })
  readonly avatarURL: string;
}
