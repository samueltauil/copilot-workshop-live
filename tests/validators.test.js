import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeDescription,
  normalizeTitle,
  validatePriority,
  validateSortBy,
  validateSortOrder,
  validateStatus,
  validateTaskId,
  validateTaskInput,
  validateTaskUpdates
} from '../src/utils/validators.js';

test('normalizeTitle trims and returns a valid title', () => {
  assert.equal(normalizeTitle('  Plan sprint  '), 'Plan sprint');
});

test('normalizeTitle throws when title is not a string', () => {
  assert.throws(() => normalizeTitle(123), {
    name: 'TypeError',
    message: 'title must be a string'
  });
});

test('normalizeTitle throws when title is empty after trim', () => {
  assert.throws(() => normalizeTitle('   '), {
    name: 'TypeError',
    message: 'title is required'
  });
});

test('normalizeDescription returns empty string for undefined', () => {
  assert.equal(normalizeDescription(undefined), '');
});

test('normalizeDescription trims valid text', () => {
  assert.equal(normalizeDescription('  Ship v1  '), 'Ship v1');
});

test('normalizeDescription throws for non-string values', () => {
  assert.throws(() => normalizeDescription(9), {
    name: 'TypeError',
    message: 'description must be a string'
  });
});

test('validateStatus accepts allowed values', () => {
  assert.equal(validateStatus('in-progress'), 'in-progress');
});

test('validateStatus rejects unsupported values', () => {
  assert.throws(() => validateStatus('blocked'), {
    name: 'TypeError',
    message: 'status must be one of: todo, in-progress, done'
  });
});

test('validatePriority accepts allowed values', () => {
  assert.equal(validatePriority('high'), 'high');
});

test('validatePriority rejects unsupported values', () => {
  assert.throws(() => validatePriority('urgent'), {
    name: 'TypeError',
    message: 'priority must be one of: low, medium, high'
  });
});

test('validateTaskId accepts UUID v4 values', () => {
  const id = '123e4567-e89b-42d3-a456-426614174000';
  assert.equal(validateTaskId(id), id);
});

test('validateTaskId rejects invalid UUID values', () => {
  assert.throws(() => validateTaskId('not-a-uuid'), {
    name: 'TypeError',
    message: 'id must be a valid UUID v4 string'
  });
});

test('validateSortBy accepts supported fields', () => {
  assert.equal(validateSortBy('createdAt'), 'createdAt');
});

test('validateSortBy rejects unsupported fields', () => {
  assert.throws(() => validateSortBy('updatedAt'), {
    name: 'TypeError',
    message: 'sortBy must be one of: priority, createdAt'
  });
});

test('validateSortOrder accepts asc and desc', () => {
  assert.equal(validateSortOrder('desc'), 'desc');
});

test('validateSortOrder rejects unsupported order values', () => {
  assert.throws(() => validateSortOrder('up'), {
    name: 'TypeError',
    message: 'sortOrder must be one of: asc, desc'
  });
});

test('validateTaskInput applies defaults and normalization', () => {
  assert.deepEqual(validateTaskInput({ title: '  Write docs  ' }), {
    title: 'Write docs',
    description: '',
    status: 'todo',
    priority: 'medium'
  });
});

test('validateTaskInput rejects non-object payloads', () => {
  assert.throws(() => validateTaskInput(null), {
    name: 'TypeError',
    message: 'task input must be a plain object'
  });
});

test('validateTaskUpdates validates and normalizes provided fields', () => {
  assert.deepEqual(validateTaskUpdates({ title: '  Refine scope  ', status: 'done' }), {
    title: 'Refine scope',
    status: 'done'
  });
});

test('validateTaskUpdates rejects payloads with no updatable fields', () => {
  assert.throws(() => validateTaskUpdates({}), {
    name: 'TypeError',
    message: 'at least one updatable field is required: title, description, status, priority'
  });
});
