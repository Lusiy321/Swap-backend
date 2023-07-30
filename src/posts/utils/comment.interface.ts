/* eslint-disable prettier/prettier */
export interface Comment {
  text: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatarURL: string;
    location: string;
  };
  answer: [
    {
      id: string;
      text: string;
      user: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        avatarURL: string;
        location: string;
      };
    },
  ];
}
