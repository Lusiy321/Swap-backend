/* eslint-disable prettier/prettier */
export interface Comment {
  text: string;
  id: string;
  user: {
    userID: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatarURL: string;
    location: string;
  };
}
