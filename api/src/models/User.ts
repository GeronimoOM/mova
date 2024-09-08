import { Flavor } from 'utils/flavor';

export type UserId = Flavor<string, 'User'>;

export interface User {
  id: UserId;
  username: string;
  password: string;
  isAdmin?: boolean;
}

export interface UserAuth {
  userId: UserId;
}
