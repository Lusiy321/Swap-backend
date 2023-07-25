export interface Comment {
    text: string;
    id: string;
    user: {
        firstName: string;
        lastName: string;
        avatarURL: string;
        isOnline: boolean;
    };
}
