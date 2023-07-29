/* eslint-disable prettier/prettier */
import { Timestamp } from 'mongodb';
import { UpdateUserDto } from 'src/users/dto/update.user.dto';

export interface Chat {
  userId: UpdateUserDto;
  text: string;
  time: Timestamp;
}
