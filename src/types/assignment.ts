import { Site } from "./site"
import { User } from "./auth";
export interface Assignment {
    _id: string;
    startDate: Date;
    endDate: Date;
    employee: User;
    site: Site;
}