import { User } from './User';

export interface Context {
  user?: User;
  clientId?: string;
  timezone?: string;
}
