import assert from 'node:assert/strict';
import test from 'node:test';
import { colorStatus, colorPriority } from '../src/utils/colors.js';

test('colorStatus returns colored string for valid status "done"', () => {
  const result = colorStatus('done');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('done'));
});

test('colorStatus returns colored string for valid status "in-progress"', () => {
  const result = colorStatus('in-progress');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('in-progress'));
});

test('colorStatus returns colored string for valid status "todo"', () => {
  const result = colorStatus('todo');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('todo'));
});

test('colorStatus throws TypeError for non-string input', () => {
  assert.throws(() => colorStatus(42), {
    name: 'TypeError',
    message: 'status must be a string'
  });
});

test('colorStatus throws TypeError for unsupported status value', () => {
  assert.throws(() => colorStatus('blocked'), {
    name: 'TypeError',
    message: 'status must be one of: todo, in-progress, done'
  });
});

test('colorPriority returns styled string for valid priority "high"', () => {
  const result = colorPriority('high');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('high'));
});

test('colorPriority returns styled string for valid priority "medium"', () => {
  const result = colorPriority('medium');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('medium'));
});

test('colorPriority returns styled string for valid priority "low"', () => {
  const result = colorPriority('low');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('low'));
});

test('colorPriority throws TypeError for non-string input', () => {
  assert.throws(() => colorPriority(null), {
    name: 'TypeError',
    message: 'priority must be a string'
  });
});

test('colorPriority throws TypeError for unsupported priority value', () => {
  assert.throws(() => colorPriority('urgent'), {
    name: 'TypeError',
    message: 'priority must be one of: low, medium, high'
  });
});
