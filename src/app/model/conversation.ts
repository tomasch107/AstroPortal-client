import { UserProfile } from 'src/app/model/user-profile';
export interface Conversation {
  id: number;
  name: string;
  participants: UserProfile[];
  readId: number[];
}
