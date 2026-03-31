import assert from 'node:assert/strict';
import test from 'node:test';
import { Task } from '../src/models/task.js';

const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test('Task constructor creates a task with normalized fields and defaults', () => {
  const task = new Task({
    title: '  Draft architecture  ',
    description: '  Initial design notes  '
  });

  assert.match(task.id, uuidV4Pattern);
  assert.equal(task.title, 'Draft architecture');
  assert.equal(task.description, 'Initial design notes');
  assert.equal(task.status, 'todo');
  assert.equal(task.priority, 'medium');
  assert.ok(!Number.isNaN(Date.parse(task.createdAt)));
  assert.equal(task.createdAt, task.updatedAt);
});

test('Task constructor preserves valid explicit status and priority', () => {
  const task = new Task({
    title: 'Release prep',
    status: 'in-progress',
    priority: 'high'
  });

  assert.equal(task.status, 'in-progress');
  assert.equal(task.priority, 'high');
});

test('Task constructor allows maximum title length boundary', () => {
  const task = new Task({
    title: 'a'.repeat(200)
  });

  assert.equal(task.title.length, 200);
});

test('Task constructor throws when title exceeds maximum length', () => {
  assert.throws(() => new Task({
    title: 'a'.repeat(201)
  }), {
    name: 'TypeError',
    message: 'title must not exceed 200 characters'
  });
});

test('Task constructor allows maximum description length boundary', () => {
  const task = new Task({
    title: 'Boundary description',
    description: 'b'.repeat(1000)
  });

  assert.equal(task.description.length, 1000);
});

test('Task constructor throws when description exceeds maximum length', () => {
  assert.throws(() => new Task({
    title: 'Boundary description',
    description: 'b'.repeat(1001)
  }), {
    name: 'TypeError',
    message: 'description must not exceed 1000 characters'
  });
});

test('Task constructor defaults missing optional description to empty string', () => {
  const task = new Task({ title: 'No description provided' });

  assert.equal(task.description, '');
});

test('Task constructor rejects non-string title type mismatch', () => {
  assert.throws(() => new Task({
    title: 42
  }), {
    name: 'TypeError',
    message: 'title must be a string'
  });
});

test('Task constructor creates unique ids for duplicate task content', () => {
  const firstTask = new Task({
    title: 'Same title',
    description: 'Same description',
    status: 'todo',
    priority: 'medium'
  });
  const secondTask = new Task({
    title: 'Same title',
    description: 'Same description',
    status: 'todo',
    priority: 'medium'
  });

  assert.notEqual(firstTask.id, secondTask.id);
});

test('Task constructor throws for invalid input payload', () => {
  assert.throws(() => new Task(null), {
    name: 'TypeError',
    message: 'task input must be a plain object'
  });
});

test('Task update applies valid changes and refreshes updatedAt only', async () => {
  const task = new Task({ title: 'Create tests' });
  const originalCreatedAt = task.createdAt;
  const originalUpdatedAt = task.updatedAt;

  await new Promise((resolve) => setTimeout(resolve, 2));
  task.update({ status: 'done', priority: 'high', title: 'Create full tests' });

  assert.equal(task.status, 'done');
  assert.equal(task.priority, 'high');
  assert.equal(task.title, 'Create full tests');
  assert.equal(task.createdAt, originalCreatedAt);
  assert.notEqual(task.updatedAt, originalUpdatedAt);
});

test('Task update throws when no updatable fields are provided', () => {
  const task = new Task({ title: 'Validate updates' });

  assert.throws(() => task.update({}), {
    name: 'TypeError',
    message: 'at least one updatable field is required: title, description, status, priority'
  });
});

test('Task update keeps state valid under rapid successive updates', async () => {
  const task = new Task({ title: 'Rapid update baseline' });

  await Promise.all([
    Promise.resolve().then(() => task.update({ status: 'in-progress' })),
    Promise.resolve().then(() => task.update({ priority: 'high' })),
    Promise.resolve().then(() => task.update({ description: 'Updated quickly' }))
  ]);

  assert.equal(task.status, 'in-progress');
  assert.equal(task.priority, 'high');
  assert.equal(task.description, 'Updated quickly');
});

test('Task toJSON returns a plain object copy', () => {
  const task = new Task({ title: 'Serialize task' });
  const taskJson = task.toJSON();

  assert.deepEqual(taskJson, {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  });

  taskJson.title = 'Mutated copy';
  assert.equal(task.title, 'Serialize task');
});
