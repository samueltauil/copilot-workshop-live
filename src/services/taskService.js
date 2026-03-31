import { Task } from '../models/task.js';
import {
  validateCategory,
  validatePriority,
  validateSortBy,
  validateSortOrder,
  validateStatus,
  validateTaskId,
  validateTaskInput,
  validateTaskUpdates
} from '../utils/validators.js';

const taskStore = new Map();
const priorityWeight = {
  low: 1,
  medium: 2,
  high: 3
};

/**
 * Create and store a new task.
 * @param {{title: string, description?: string, status?: string, priority?: string, category?: string}} input - Task input.
 * @returns {{id: string, title: string, description: string, status: string, priority: string, category: string, createdAt: string, updatedAt: string}} The created task copy.
 */
export function createTask(input) {
  try {
    validateTaskInput(input);
    const task = new Task(input);
    taskStore.set(task.id, task);
    return task.toJSON();
  } catch (error) {
    throw new Error(`invalid input: ${error.message}`);
  }
}

/**
 * Return a task by its ID.
 * @param {string} id - Task ID.
 * @returns {{id: string, title: string, description: string, status: string, priority: string, category: string, createdAt: string, updatedAt: string}} A task copy.
 */
export function getTaskById(id) {
  validateTaskId(id);

  const task = taskStore.get(id);
  if (!task) {
    throw new Error(`not found: task ${id} does not exist`);
  }

  return task.toJSON();
}

/**
 * Return all tasks, optionally filtered and sorted.
 * @param {{status?: string, priority?: string, category?: string, sortBy?: string, sortOrder?: string}} [options={}] - Query options.
 * @returns {Array<{id: string, title: string, description: string, status: string, priority: string, category: string, createdAt: string, updatedAt: string}>} Copies of matching tasks.
 */
export function listTasks(options = {}) {
  if (typeof options !== 'object' || options === null || Array.isArray(options)) {
    throw new Error('invalid input: options must be a plain object');
  }

  const {
    status,
    priority,
    category,
    sortBy,
    sortOrder = 'asc'
  } = options;

  if (status !== undefined) {
    validateStatus(status);
  }

  if (priority !== undefined) {
    validatePriority(priority);
  }

  if (category !== undefined) {
    validateCategory(category);
  }

  if (sortBy !== undefined) {
    validateSortBy(sortBy);
    validateSortOrder(sortOrder);
  }

  let tasks = Array.from(taskStore.values()).map((task) => task.toJSON());

  if (status !== undefined) {
    tasks = tasks.filter((task) => task.status === status);
  }

  if (priority !== undefined) {
    tasks = tasks.filter((task) => task.priority === priority);
  }

  if (category !== undefined) {
    tasks = tasks.filter((task) => task.category === category);
  }

  if (sortBy === 'priority') {
    tasks.sort((taskA, taskB) => {
      const difference = priorityWeight[taskA.priority] - priorityWeight[taskB.priority];
      return sortOrder === 'asc' ? difference : -difference;
    });
  }

  if (sortBy === 'createdAt') {
    tasks.sort((taskA, taskB) => {
      const difference = Date.parse(taskA.createdAt) - Date.parse(taskB.createdAt);
      return sortOrder === 'asc' ? difference : -difference;
    });
  }

  return tasks;
}

/**
 * Update an existing task.
 * @param {string} id - Task ID.
 * @param {{title?: string, description?: string, status?: string, priority?: string, category?: string}} updates - Update payload.
 * @returns {{id: string, title: string, description: string, status: string, priority: string, category: string, createdAt: string, updatedAt: string}} Updated task copy.
 */
export function updateTask(id, updates) {
  validateTaskId(id);

  const task = taskStore.get(id);
  if (!task) {
    throw new Error(`not found: task ${id} does not exist`);
  }

  try {
    const normalizedUpdates = validateTaskUpdates(updates);
    const updatedTask = task.update(normalizedUpdates);
    return updatedTask.toJSON();
  } catch (error) {
    throw new Error(`invalid input: ${error.message}`);
  }
}

/**
 * Delete a task by ID.
 * @param {string} id - Task ID.
 * @returns {{id: string, title: string, description: string, status: string, priority: string, category: string, createdAt: string, updatedAt: string}} Deleted task copy.
 */
export function deleteTask(id) {
  validateTaskId(id);

  const task = taskStore.get(id);
  if (!task) {
    throw new Error(`not found: task ${id} does not exist`);
  }

  const deletedTask = task.toJSON();
  taskStore.delete(id);
  return deletedTask;
}

/**
 * Reset in-memory tasks.
 * @returns {number} The number of cleared tasks.
 */
export function clearTasks() {
  const size = taskStore.size;
  taskStore.clear();
  return size;
}
