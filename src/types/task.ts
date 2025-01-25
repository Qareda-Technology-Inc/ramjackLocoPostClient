import { KPI } from "./kpi";

export interface Tasks {
    _id: string;
    isCompleted: boolean;
    comment: string;
    completionDate: Date | string;
    task: Task;
}

export interface Task {
    _id: string;
    name: string;
    description: string;
    kpi: KPI;
}
