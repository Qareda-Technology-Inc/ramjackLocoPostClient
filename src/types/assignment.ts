import { User } from './auth';
import { Site } from './site';

export interface Assignment {
  _id: string;
  employee: User;
  site: Site;
  startDate: Date | string;
  endDate: Date | string;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
}