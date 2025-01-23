import { KPI } from "./kpi";

export interface Task {
    _id: string;
    name: string;
    description: string;
    kpi: KPI;
    isCompleted: boolean;
    comment: string;
}