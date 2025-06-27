export interface UserUpdateData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarURL: string;
  location: string;
}

export interface TokenPayload {
  id: string;
  iat: number;
}
