import { User } from './auth';
import { Site } from './site';
import { Tasks } from './task';

export interface Assignment {
  _id: string;
  employee: User;
  site: Site;
  tasks: Tasks[];
  startDate: Date | string;
  endDate: Date | string;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  isApproved: boolean;
  isCompleted: boolean;
}