import './base.css';
import './index.css';
export declare class Todo {
    description: string;
    editDescription: string;
    completed: boolean;
    editing: boolean;
}
export declare class TodoApp {
    newEntry: string;
    filter: "ALL" | "ACTIVE" | "COMPLETED";
    list: Todo[];
    readonly listView: Todo[];
    readonly itemsLeft: number;
}
