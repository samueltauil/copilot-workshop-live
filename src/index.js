import {
  clearTasks,
  createTask,
  deleteTask,
  listTasks,
  updateTask
} from './services/taskService.js';

/**
 * Demonstrate Task Manager capabilities end to end.
 * @returns {void}
 */
function runDemo() {
  console.log('Task Manager demo starting...');

  const firstTask = createTask({
    title: 'Write project brief',
    description: 'Draft scope and constraints for the CLI.',
    priority: 'high'
  });

  const secondTask = createTask({
    title: 'Implement task update flow',
    description: 'Support status and priority changes.',
    status: 'in-progress',
    priority: 'medium'
  });

  const thirdTask = createTask({
    title: 'Prepare release checklist',
    description: 'List verification steps before shipping.',
    status: 'todo',
    priority: 'low'
  });

  console.log('\nCreated tasks:');
  console.log(firstTask);
  console.log(secondTask);
  console.log(thirdTask);

  console.log('\nAll tasks:');
  console.log(listTasks());

  console.log('\nUpdate one task:');
  const updatedTask = updateTask(secondTask.id, {
    status: 'done',
    priority: 'high',
    title: 'Implement and finalize update flow'
  });
  console.log(updatedTask);

  console.log('\nFilter by status=todo:');
  console.log(listTasks({ status: 'todo' }));

  console.log('\nFilter by priority=high:');
  console.log(listTasks({ priority: 'high' }));

  console.log('\nSort by priority (desc):');
  console.log(listTasks({ sortBy: 'priority', sortOrder: 'desc' }));

  console.log('\nSort by createdAt (asc):');
  console.log(listTasks({ sortBy: 'createdAt', sortOrder: 'asc' }));

  console.log('\nDelete one task:');
  const deletedTask = deleteTask(firstTask.id);
  console.log(deletedTask);

  console.log('\nRemaining tasks after delete:');
  console.log(listTasks());

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
