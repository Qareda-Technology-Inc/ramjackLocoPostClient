import { User } from '@/types/auth';

export interface Site {
    _id: string;
    name: string;
    description: string;
    location: string;
    image: string;
    country: string;
    employees: User[];
    active: boolean;
}
