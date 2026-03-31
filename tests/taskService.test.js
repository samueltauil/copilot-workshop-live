import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import {
  clearTasks,
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask
} from '../src/services/taskService.js';

beforeEach(() => {
  clearTasks();
});

afterEach(() => {
  clearTasks();
});

test('createTask stores and returns a normalized task copy', () => {
  const created = createTask({
    title: '  Build CLI parser  ',
    description: '  Parse argv safely  '
  });

  assert.equal(created.title, 'Build CLI parser');
  assert.equal(created.description, 'Parse argv safely');
  assert.equal(created.status, 'todo');
  assert.equal(created.priority, 'medium');
  assert.equal(created.category, 'general');

  const tasks = listTasks();
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].id, created.id);
});

test('createTask throws invalid input errors with service prefix', () => {
  assert.throws(() => createTask({ title: '' }), {
    name: 'Error',
    message: 'invalid input: title is required'
  });
});

test('getTaskById returns a copy of an existing task', () => {
  const created = createTask({ title: 'Find by id' });
  const found = getTaskById(created.id);

  assert.deepEqual(found, created);
  found.title = 'Mutated local copy';

  const foundAgain = getTaskById(created.id);
  assert.equal(foundAgain.title, 'Find by id');
});

test('getTaskById throws for invalid UUID format', () => {
  assert.throws(() => getTaskById('bad-id'), {
    name: 'TypeError',
    message: 'id must be a valid UUID v4 string'
  });
});

test('getTaskById throws not found for missing task IDs', () => {
  const missingId = '123e4567-e89b-42d3-a456-426614174000';

  assert.throws(() => getTaskById(missingId), {
    name: 'Error',
    message: `not found: task ${missingId} does not exist`
  });
});

test('listTasks filters by status and priority together', () => {
  createTask({ title: 'A', status: 'todo', priority: 'high', category: 'work' });
  createTask({ title: 'B', status: 'todo', priority: 'low', category: 'personal' });
  createTask({ title: 'C', status: 'done', priority: 'high', category: 'work' });

  const filtered = listTasks({ status: 'todo', priority: 'high' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].title, 'A');
});

test('listTasks filters by category', () => {
  createTask({ title: 'Work one', category: 'work' });
  createTask({ title: 'Personal one', category: 'personal' });
  createTask({ title: 'Work two', category: 'work' });

  const filtered = listTasks({ category: 'work' });
  assert.equal(filtered.length, 2);
  assert.deepEqual(filtered.map((task) => task.title), ['Work one', 'Work two']);
});

test('listTasks applies status, priority, and category filters together', () => {
  createTask({ title: 'A', status: 'todo', priority: 'high', category: 'work' });
  createTask({ title: 'B', status: 'todo', priority: 'high', category: 'personal' });
  createTask({ title: 'C', status: 'todo', priority: 'low', category: 'work' });
  createTask({ title: 'D', status: 'done', priority: 'high', category: 'work' });

  const filtered = listTasks({ status: 'todo', priority: 'high', category: 'work' });

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].title, 'A');
});

test('listTasks returns an empty array when category filter has no matches', () => {
  createTask({ title: 'Work only', category: 'work' });

  const filtered = listTasks({ category: 'urgent' });

  assert.deepEqual(filtered, []);
});

test('listTasks rejects invalid category filter values', () => {
  assert.throws(() => listTasks({ category: '   ' }), {
    name: 'TypeError',
    message: 'category must be a non-empty string'
  });
});

test('listTasks sorts tasks by priority ascending', () => {
  createTask({ title: 'Low task', priority: 'low' });
  createTask({ title: 'High task', priority: 'high' });
  createTask({ title: 'Medium task', priority: 'medium' });

  const sorted = listTasks({ sortBy: 'priority', sortOrder: 'asc' });
  assert.deepEqual(sorted.map((task) => task.priority), ['low', 'medium', 'high']);
});

test('listTasks sorts tasks by createdAt descending', async () => {
  createTask({ title: 'Oldest' });
  await new Promise((resolve) => setTimeout(resolve, 2));
  createTask({ title: 'Middle' });
  await new Promise((resolve) => setTimeout(resolve, 2));
  createTask({ title: 'Newest' });

  const sorted = listTasks({ sortBy: 'createdAt', sortOrder: 'desc' });
  assert.deepEqual(sorted.map((task) => task.title), ['Newest', 'Middle', 'Oldest']);
});

test('listTasks rejects invalid options payload', () => {
  assert.throws(() => listTasks([]), {
    name: 'Error',
    message: 'invalid input: options must be a plain object'
  });
});

test('listTasks returns an empty array when store is empty', () => {
  const tasks = listTasks();

  assert.deepEqual(tasks, []);
});

test('createTask allows duplicate task content as separate entries', () => {
  const first = createTask({
    title: 'Duplicate title',
    description: 'Same content',
    status: 'todo',
    priority: 'medium'
  });
  const second = createTask({
    title: 'Duplicate title',
    description: 'Same content',
    status: 'todo',
    priority: 'medium'
  });

  const allTasks = listTasks();
  assert.equal(allTasks.length, 2);
  assert.notEqual(first.id, second.id);
});

test('listTasks result behaves like a snapshot during add-while-iterating', () => {
  createTask({ title: 'First task' });
  createTask({ title: 'Second task' });

  const snapshot = listTasks();
  const seenIds = [];

  for (const task of snapshot) {
    seenIds.push(task.id);

    if (seenIds.length === 1) {
      createTask({ title: 'Added during iteration' });
    }
  }

  assert.equal(snapshot.length, 2);
  assert.equal(seenIds.length, 2);
  assert.equal(listTasks().length, 3);
});

test('updateTask updates fields and returns the updated copy', () => {
  const created = createTask({ title: 'Update me', status: 'todo' });

  const updated = updateTask(created.id, {
    status: 'in-progress',
    priority: 'high',
    category: 'urgent'
  });

  assert.equal(updated.id, created.id);
  assert.equal(updated.status, 'in-progress');
  assert.equal(updated.priority, 'high');
  assert.equal(updated.category, 'urgent');
});

test('updateTask throws not found for unknown IDs', () => {
  const missingId = '123e4567-e89b-42d3-a456-426614174000';

  assert.throws(() => updateTask(missingId, { status: 'done' }), {
    name: 'Error',
    message: `not found: task ${missingId} does not exist`
  });
});

test('updateTask wraps validation failures with service prefix', () => {
  const created = createTask({ title: 'Bad update target' });

  assert.throws(() => updateTask(created.id, { status: 'blocked' }), {
    name: 'Error',
    message: 'invalid input: status must be one of: todo, in-progress, done'
  });
});

test('deleteTask removes a task and returns the deleted copy', () => {
  const created = createTask({ title: 'Delete me' });
  const deleted = deleteTask(created.id);

  assert.equal(deleted.id, created.id);
  assert.equal(listTasks().length, 0);
});

test('deleteTask throws not found for unknown IDs', () => {
  const missingId = '123e4567-e89b-42d3-a456-426614174000';

  assert.throws(() => deleteTask(missingId), {
    name: 'Error',
    message: `not found: task ${missingId} does not exist`
  });
});

test('clearTasks returns the number of cleared tasks', () => {
  createTask({ title: 'Task one' });
  createTask({ title: 'Task two' });

  const clearedCount = clearTasks();
  assert.equal(clearedCount, 2);
  assert.equal(listTasks().length, 0);
});
