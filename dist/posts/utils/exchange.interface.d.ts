export interface Exchange {
    id: string;
    agree: boolean;
    data: {
        _id: string;
        title: string;
        description: string;
        img: string;
        price: number;
        verify: string;
        views: number;
        favorite: [];
        createdAt: string;
        updatedAt: string;
        owner: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatarURL: string;
            location: string;
        };
    };
}
