import { Posts } from '../posts.model';
export interface Exchange {
    agree: boolean;
    data: Posts;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        avatarURL: string;
        location: string;
    };
}
