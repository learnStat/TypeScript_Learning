// ============================================
// TYPESCRIPT LEARNING: TASK MANAGER
// ============================================
// This file demonstrates: classes, types, DOM manipulation, and more!

import { Task, Priority, TaskStatus } from './types.js';

// CLASS: A blueprint for creating objects
// Classes can have properties and methods
class TaskManagerApp {
  // PRIVATE PROPERTY: Can only be accessed within this class
  // The 'private' keyword is a TypeScript feature
  private tasks: Task[] = [];
  private nextId: number = 1;

  // CONSTRUCTOR: Runs when you create a new instance of the class
  constructor() {
    this.loadTasksFromStorage();
    this.setupEventListeners();
    this.renderTasks();
  }

  // METHOD: A function that belongs to a class
  // PARAMETERS WITH TYPES: TypeScript checks that you pass the right types
  private addTask(title: string, description: string, priority: Priority): void {
    // OBJECT LITERAL: Creating a new object that matches the Task interface
    const newTask: Task = {
      id: this.nextId++,
      title: title,
      description: description,
      completed: false,
      createdAt: new Date(),
      priority: priority
    };

    this.tasks.push(newTask);
    this.saveTasksToStorage();
    this.renderTasks();
  }

  // METHOD WITH TYPE CHECKING
  // TypeScript ensures 'id' is a number
  private deleteTask(id: number): void {
    // ARRAY FILTER: Creates a new array without the deleted task
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasksToStorage();
    this.renderTasks();
  }

  private toggleTask(id: number): void {
    // ARRAY FIND: Finds the first element that matches the condition
    // Note the '?' - this means task might be undefined
    const task = this.tasks.find(t => t.id === id);

    // TYPE GUARD: Check if task exists before using it
    if (task) {
      task.completed = !task.completed;
      this.saveTasksToStorage();
      this.renderTasks();
    }
  }

  // METHOD WITH RETURN TYPE
  // This method returns an array of Task objects
  private filterTasks(status: TaskStatus): Task[] {
    // SWITCH STATEMENT with TYPE-SAFE enum values
    switch (status) {
      case "active":
        return this.tasks.filter(task => !task.completed);
      case "completed":
        return this.tasks.filter(task => task.completed);
      case "all":
      default:
        return this.tasks;
    }
  }

  private renderTasks(filter: TaskStatus = "all"): void {
    // DOM MANIPULATION: Get elements from HTML
    // TYPE ASSERTION: Tell TypeScript the exact type
    const taskList = document.getElementById('taskList') as HTMLDivElement;

    if (!taskList) return;

    // Clear existing tasks
    taskList.innerHTML = '';

    // Get filtered tasks
    const filteredTasks = this.filterTasks(filter);

    // Check if there are no tasks
    if (filteredTasks.length === 0) {
      taskList.innerHTML = '<p class="no-tasks">No tasks to display. Add one above!</p>';
      return;
    }

    // FOREACH LOOP: Iterate through each task
    filteredTasks.forEach(task => {
      // Create task element
      const taskElement = document.createElement('div');
      taskElement.className = `task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`;

      // TEMPLATE LITERAL: Use ${} to embed variables in strings
      taskElement.innerHTML = `
        <div class="task-header">
          <input type="checkbox" ${task.completed ? 'checked' : ''}
                 data-id="${task.id}" class="task-checkbox">
          <h3>${task.title}</h3>
          <span class="priority-badge ${task.priority}">${task.priority}</span>
        </div>
        <p>${task.description}</p>
        <div class="task-footer">
          <small>Created: ${task.createdAt.toLocaleDateString()}</small>
          <button class="delete-btn" data-id="${task.id}">Delete</button>
        </div>
      `;

      taskList.appendChild(taskElement);
    });

    // Update task counter
    this.updateCounter();
  }

  private updateCounter(): void {
    const activeCount = this.tasks.filter(t => !t.completed).length;
    const totalCount = this.tasks.length;
    const counter = document.getElementById('taskCounter');

    if (counter) {
      counter.textContent = `${activeCount} active / ${totalCount} total tasks`;
    }
  }

  private setupEventListeners(): void {
    // ADD TASK FORM
    const form = document.getElementById('addTaskForm') as HTMLFormElement;

    if (form) {
      // EVENT LISTENER: Responds to form submission
      form.addEventListener('submit', (e: Event) => {
        e.preventDefault();

        // Get form values with type assertions
        const titleInput = document.getElementById('taskTitle') as HTMLInputElement;
        const descInput = document.getElementById('taskDesc') as HTMLInputElement;
        const prioritySelect = document.getElementById('taskPriority') as HTMLSelectElement;

        // Validate inputs
        if (titleInput.value.trim() && descInput.value.trim()) {
          this.addTask(
            titleInput.value.trim(),
            descInput.value.trim(),
            prioritySelect.value as Priority
          );

          // Clear form
          form.reset();
        }
      });
    }

    // TASK LIST EVENT DELEGATION
    const taskList = document.getElementById('taskList');

    if (taskList) {
      taskList.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;

        // Handle checkbox toggle
        if (target.classList.contains('task-checkbox')) {
          const id = parseInt(target.getAttribute('data-id') || '0');
          this.toggleTask(id);
        }

        // Handle delete button
        if (target.classList.contains('delete-btn')) {
          const id = parseInt(target.getAttribute('data-id') || '0');
          this.deleteTask(id);
        }
      });
    }

    // FILTER BUTTONS
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLButtonElement;
        const filter = target.getAttribute('data-filter') as TaskStatus;

        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        // Render filtered tasks
        this.renderTasks(filter);
      });
    });
  }

  // LOCAL STORAGE: Save tasks to browser storage
  private saveTasksToStorage(): void {
    // JSON.stringify converts objects to strings
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  private loadTasksFromStorage(): void {
    const stored = localStorage.getItem('tasks');

    if (stored) {
      try {
        // JSON.parse converts strings back to objects
        const parsed = JSON.parse(stored);

        // TYPE CHECKING: Ensure dates are properly converted
        this.tasks = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));

        // Update nextId to avoid conflicts
        if (this.tasks.length > 0) {
          this.nextId = Math.max(...this.tasks.map(t => t.id)) + 1;
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        this.tasks = [];
      }
    }
  }
}

// INITIALIZE APP: Create an instance when the page loads
// 'DOMContentLoaded' ensures HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Creating a new instance of TaskManagerApp
  new TaskManagerApp();
});
