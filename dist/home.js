// ============================================
// TYPESCRIPT LEARNING: TASK MANAGER
// ============================================
// This file demonstrates: classes, types, DOM manipulation, and more!
// CLASS: A blueprint for creating objects
// Classes can have properties and methods
class TaskManagerApp {
    // CONSTRUCTOR: Runs when you create a new instance of the class
    constructor() {
        // PRIVATE PROPERTY: Can only be accessed within this class
        // The 'private' keyword is a TypeScript feature
        this.tasks = [];
        this.nextId = 1;
        this.loadTasksFromStorage();
        this.setupEventListeners();
        this.renderTasks();
    }
    // METHOD: A function that belongs to a class
    // PARAMETERS WITH TYPES: TypeScript checks that you pass the right types
    addTask(title, description, priority) {
        // OBJECT LITERAL: Creating a new object that matches the Task interface
        const newTask = {
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
    deleteTask(id) {
        // ARRAY FILTER: Creates a new array without the deleted task
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasksToStorage();
        this.renderTasks();
    }
    toggleTask(id) {
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
    filterTasks(status) {
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
    renderTasks(filter = "all") {
        // DOM MANIPULATION: Get elements from HTML
        // TYPE ASSERTION: Tell TypeScript the exact type
        const taskList = document.getElementById('taskList');
        if (!taskList)
            return;
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
    updateCounter() {
        const activeCount = this.tasks.filter(t => !t.completed).length;
        const totalCount = this.tasks.length;
        const counter = document.getElementById('taskCounter');
        if (counter) {
            counter.textContent = `${activeCount} active / ${totalCount} total tasks`;
        }
    }
    setupEventListeners() {
        // ADD TASK FORM
        const form = document.getElementById('addTaskForm');
        if (form) {
            // EVENT LISTENER: Responds to form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Get form values with type assertions
                const titleInput = document.getElementById('taskTitle');
                const descInput = document.getElementById('taskDesc');
                const prioritySelect = document.getElementById('taskPriority');
                // Validate inputs
                if (titleInput.value.trim() && descInput.value.trim()) {
                    this.addTask(titleInput.value.trim(), descInput.value.trim(), prioritySelect.value);
                    // Clear form
                    form.reset();
                }
            });
        }
        // TASK LIST EVENT DELEGATION
        const taskList = document.getElementById('taskList');
        if (taskList) {
            taskList.addEventListener('click', (e) => {
                const target = e.target;
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
            btn.addEventListener('click', (e) => {
                const target = e.target;
                const filter = target.getAttribute('data-filter');
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                target.classList.add('active');
                // Render filtered tasks
                this.renderTasks(filter);
            });
        });
    }
    // LOCAL STORAGE: Save tasks to browser storage
    saveTasksToStorage() {
        // JSON.stringify converts objects to strings
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    loadTasksFromStorage() {
        const stored = localStorage.getItem('tasks');
        if (stored) {
            try {
                // JSON.parse converts strings back to objects
                const parsed = JSON.parse(stored);
                // TYPE CHECKING: Ensure dates are properly converted
                this.tasks = parsed.map((task) => ({
                    ...task,
                    createdAt: new Date(task.createdAt)
                }));
                // Update nextId to avoid conflicts
                if (this.tasks.length > 0) {
                    this.nextId = Math.max(...this.tasks.map(t => t.id)) + 1;
                }
            }
            catch (error) {
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
export {};
//# sourceMappingURL=home.js.map