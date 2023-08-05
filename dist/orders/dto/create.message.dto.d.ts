import { UpdateUserDto } from 'src/users/dto/update.user.dto';
export declare class CreateMessageDto {
    id: string;
    readonly text: string;
    user: UpdateUserDto;
    time: number;
}
