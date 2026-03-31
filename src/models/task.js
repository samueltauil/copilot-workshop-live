import { randomUUID } from 'node:crypto';
import {
  normalizeDescription,
  normalizeTitle,
  validatePriority,
  validateStatus,
  validateTaskInput,
  validateTaskUpdates
} from '../utils/validators.js';

/**
 * Represents a task entity in memory.
 */
export class Task {
  /**
   * Create a Task instance from user-provided input.
   * @param {{title: string, description?: string, status?: string, priority?: string}} input - Task creation input.
   */
  constructor(input) {
    const normalizedInput = validateTaskInput(input);

    this.id = randomUUID();
    this.title = normalizedInput.title;
    this.description = normalizedInput.description;
    this.status = normalizedInput.status;
    this.priority = normalizedInput.priority;
    const timestamp = new Date().toISOString();
    this.createdAt = timestamp;
    this.updatedAt = timestamp;

    // Defensive checks keep constructor guarantees explicit.
    normalizeTitle(this.title);
    normalizeDescription(this.description);
    validateStatus(this.status);
    validatePriority(this.priority);
  }

  /**
   * Apply validated updates and refresh modification timestamp.
   * @param {{title?: string, description?: string, status?: string, priority?: string}} updates - Fields to update.
   * @returns {Task} The updated task instance.
   */
  update(updates) {
    const normalizedUpdates = validateTaskUpdates(updates);

    if (normalizedUpdates.title !== undefined) {
      this.title = normalizedUpdates.title;
    }

    if (normalizedUpdates.description !== undefined) {
      this.description = normalizedUpdates.description;
    }

    if (normalizedUpdates.status !== undefined) {
      this.status = normalizedUpdates.status;
    }

    if (normalizedUpdates.priority !== undefined) {
      this.priority = normalizedUpdates.priority;
    }

    this.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Convert the task to a plain object for safe external use.
   * @returns {{id: string, title: string, description: string, status: string, priority: string, createdAt: string, updatedAt: string}} Serializable task object.
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
