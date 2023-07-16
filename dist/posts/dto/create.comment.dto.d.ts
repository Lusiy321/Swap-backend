import { CommentUserDto } from 'src/users/dto/comments.user.dto';
export declare class CreateCommentDto {
    id: string;
    user: CommentUserDto;
    readonly text: string;
    answer: Array<object>;
}
