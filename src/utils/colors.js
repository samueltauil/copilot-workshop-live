import chalk from 'chalk';

/**
 * Wrap a task status value in the appropriate chalk color.
 * @param {string} status - Task status ('todo', 'in-progress', or 'done').
 * @returns {string} Chalk-colored status string.
 * @throws {TypeError} When status is not a string or is not one of the allowed values.
 * @example
 * colorStatus('done');
 * // green-colored 'done'
 * @example
 * colorStatus('todo');
 * // red-colored 'todo'
 */
export function colorStatus(status) {
  if (typeof status !== 'string') {
    throw new TypeError('status must be a string');
  }

  switch (status) {
    case 'done':
      return chalk.green(status);
    case 'in-progress':
      return chalk.yellow(status);
    case 'todo':
      return chalk.red(status);
    default:
      throw new TypeError('status must be one of: todo, in-progress, done');
  }
}

/**
 * Wrap a task priority value in the appropriate chalk style.
 * @param {string} priority - Task priority ('low', 'medium', or 'high').
 * @returns {string} Chalk-styled priority string.
 * @throws {TypeError} When priority is not a string or is not one of the allowed values.
 * @example
 * colorPriority('high');
 * // bold red 'high'
 * @example
 * colorPriority('low');
 * // dim 'low'
 */
export function colorPriority(priority) {
  if (typeof priority !== 'string') {
    throw new TypeError('priority must be a string');
  }

  switch (priority) {
    case 'high':
      return chalk.bold.red(priority);
    case 'medium':
      return chalk.bold.yellow(priority);
    case 'low':
      return chalk.dim(priority);
    default:
      throw new TypeError('priority must be one of: low, medium, high');
  }
}
