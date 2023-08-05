/* eslint-disable prettier/prettier */
export interface Chat {
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
}
