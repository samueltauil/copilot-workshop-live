import {
  clearTasks,
  createTask,
  deleteTask,
  listTasks,
  updateTask
} from './services/taskService.js';
import { colorPriority, colorStatus } from './utils/colors.js';

/**
 * Format a task object for display, applying chalk colors to status and priority.
 * @param {object} task - Task object.
 * @returns {string} Formatted task string.
 */
function formatTask(task) {
  return `[${task.id}] ${task.title} | category: ${task.category} | status: ${colorStatus(task.status)} | priority: ${colorPriority(task.priority)}`;
}

/**
 * Demonstrate Task Manager capabilities end to end.
 * @returns {void}
 */
function runDemo() {
  console.log('Task Manager demo starting...');

  const firstTask = createTask({
    title: 'Write project brief',
    description: 'Draft scope and constraints for the CLI.',
    priority: 'high',
    category: 'work'
  });

  const secondTask = createTask({
    title: 'Implement task update flow',
    description: 'Support status and priority changes.',
    status: 'in-progress',
    priority: 'medium',
    category: 'urgent'
  });

  const thirdTask = createTask({
    title: 'Prepare release checklist',
    description: 'List verification steps before shipping.',
    status: 'todo',
    priority: 'low',
    category: 'personal'
  });

  console.log('\nCreated tasks:');
  console.log(formatTask(firstTask));
  console.log(formatTask(secondTask));
  console.log(formatTask(thirdTask));

  console.log('\nAll tasks:');
  listTasks().forEach(t => console.log(formatTask(t)));

  console.log('\nUpdate one task:');
  const updatedTask = updateTask(secondTask.id, {
    status: 'done',
    priority: 'high',
    title: 'Implement and finalize update flow'
  });
  console.log(formatTask(updatedTask));

  console.log('\nFilter by status=todo:');
  listTasks({ status: 'todo' }).forEach(t => console.log(formatTask(t)));

  console.log('\nFilter by priority=high:');
  listTasks({ priority: 'high' }).forEach(t => console.log(formatTask(t)));

  console.log('\nFilter by category=work:');
  listTasks({ category: 'work' }).forEach(t => console.log(formatTask(t)));

  console.log('\nSort by priority (desc):');
  listTasks({ sortBy: 'priority', sortOrder: 'desc' }).forEach(t => console.log(formatTask(t)));

  console.log('\nSort by createdAt (asc):');
  listTasks({ sortBy: 'createdAt', sortOrder: 'asc' }).forEach(t => console.log(formatTask(t)));

  console.log('\nDelete one task:');
  const deletedTask = deleteTask(firstTask.id);
  console.log(formatTask(deletedTask));

  console.log('\nRemaining tasks after delete:');
  listTasks().forEach(t => console.log(formatTask(t)));

  const clearedCount = clearTasks();
  console.log(`\nCleared ${clearedCount} task(s) from memory.`);
  console.log('Task Manager demo completed.');
}

try {
  runDemo();
} catch (error) {
  console.error(`Task Manager demo failed: ${error.message}`);
  process.exitCode = 1;
}
