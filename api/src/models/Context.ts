import { User } from './User';

export interface Context {
  user: User;
  clientId?: string;
  timezone?: string;

  sortExercises?: boolean;
}

export interface BaseContext extends Omit<Context, 'user'> {
  user?: User;
}
