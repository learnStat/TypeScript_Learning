// ============================================
// TYPESCRIPT LEARNING: TYPES AND INTERFACES
// ============================================

// 1. BASIC TYPES
// TypeScript has several basic types: string, number, boolean, array, etc.

// 2. INTERFACE: Defines the structure of an object
// This is like a contract that objects must follow
export interface Task {
  id: number;           // Must be a number
  title: string;        // Must be a string
  description: string;  // Must be a string
  completed: boolean;   // Must be a boolean (true or false)
  createdAt: Date;      // Must be a Date object
  priority: Priority;   // Must be one of the Priority enum values
}

// 3. ENUM: A set of named constants
// Enums make your code more readable and prevent typos
export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high"
}

// 4. TYPE ALIAS: Creates a new name for a type
// Similar to interface but more flexible
export type TaskStatus = "all" | "active" | "completed";

// 5. INTERFACE FOR FORM DATA
// Notice how we can make properties optional with '?'
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;  // Optional property (might not exist)
}

// 6. INTERFACE WITH METHODS
// Interfaces can also define function signatures
export interface TaskManager {
  tasks: Task[];
  addTask(title: string, description: string, priority: Priority): void;
  deleteTask(id: number): void;
  toggleTask(id: number): void;
  filterTasks(status: TaskStatus): Task[];
}
