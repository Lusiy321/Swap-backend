import { Timestamp } from 'mongodb';
import { UpdateUserDto } from 'src/users/dto/update.user.dto';
export interface Chat {
    user: UpdateUserDto;
    text: string;
    time: Timestamp;
}
