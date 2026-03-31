/**
 * Normalize and validate a task title.
 * @param {string} title - Candidate title.
 * @returns {string} Trimmed title.
 * @throws {TypeError} When title is not a non-empty string within 200 chars.
 * @example
 * normalizeTitle('  Buy milk  ');
 * // 'Buy milk'
 * @example
 * normalizeTitle('Plan sprint');
 * // 'Plan sprint'
 */
export function normalizeTitle(title) {
  if (typeof title !== 'string') {
    throw new TypeError('title must be a string');
  }

  const normalizedTitle = title.trim();
  if (normalizedTitle.length === 0) {
    throw new TypeError('title is required');
  }

  if (normalizedTitle.length > 200) {
    throw new TypeError('title must not exceed 200 characters');
  }

  return normalizedTitle;
}

/**
 * Normalize and validate a task description.
 * @param {string|undefined} description - Candidate description.
 * @returns {string} Trimmed description or empty string.
 * @throws {TypeError} When description is not a string or exceeds 1000 chars.
 * @example
 * normalizeDescription('  Ship v1  ');
 * // 'Ship v1'
 * @example
 * normalizeDescription(undefined);
 * // ''
 */
export function normalizeDescription(description) {
  if (description === undefined) {
    return '';
  }

  if (typeof description !== 'string') {
    throw new TypeError('description must be a string');
  }

  const normalizedDescription = description.trim();
  if (normalizedDescription.length > 1000) {
    throw new TypeError('description must not exceed 1000 characters');
  }

  return normalizedDescription;
}

/**
 * Validate a task status value.
 * @param {string} status - Candidate task status.
 * @returns {string} The validated status.
 * @throws {TypeError} When status is not one of the allowed values.
 * @example
 * validateStatus('todo');
 * // 'todo'
 * @example
 * validateStatus('done');
 * // 'done'
 */
export function validateStatus(status) {
  const allowedStatuses = new Set(['todo', 'in-progress', 'done']);
  if (typeof status !== 'string' || !allowedStatuses.has(status)) {
    throw new TypeError('status must be one of: todo, in-progress, done');
  }

  return status;
}

/**
 * Validate a task priority value.
 * @param {string} priority - Candidate task priority.
 * @returns {string} The validated priority.
 * @throws {TypeError} When priority is not one of the allowed values.
 * @example
 * validatePriority('low');
 * // 'low'
 * @example
 * validatePriority('high');
 * // 'high'
 */
export function validatePriority(priority) {
  const allowedPriorities = new Set(['low', 'medium', 'high']);
  if (typeof priority !== 'string' || !allowedPriorities.has(priority)) {
    throw new TypeError('priority must be one of: low, medium, high');
  }

  return priority;
}

/**
 * Validate a task ID.
 * @param {string} id - Candidate UUID v4.
 * @returns {string} The validated ID.
 * @throws {TypeError} When id is not a valid UUID v4 string.
 * @example
 * validateTaskId('123e4567-e89b-42d3-a456-426614174000');
 * // '123e4567-e89b-42d3-a456-426614174000'
 * @example
 * validateTaskId('4e6d0ba9-1a2f-4f29-8be7-a66f6f614f48');
 * // '4e6d0ba9-1a2f-4f29-8be7-a66f6f614f48'
 */
export function validateTaskId(id) {
  const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (typeof id !== 'string' || !uuidV4Pattern.test(id)) {
    throw new TypeError('id must be a valid UUID v4 string');
  }

  return id;
}

/**
 * Validate sort field input.
 * @param {string} field - Sort field.
 * @returns {string} Validated sort field.
 * @throws {TypeError} When sort field is unsupported.
 * @example
 * validateSortBy('priority');
 * // 'priority'
 * @example
 * validateSortBy('createdAt');
 * // 'createdAt'
 */
export function validateSortBy(field) {
  const allowedSortFields = new Set(['priority', 'createdAt']);
  if (typeof field !== 'string' || !allowedSortFields.has(field)) {
    throw new TypeError('sortBy must be one of: priority, createdAt');
  }

  return field;
}

/**
 * Validate sort order input.
 * @param {string} order - Sort direction.
 * @returns {string} Validated sort order.
 * @throws {TypeError} When sort order is unsupported.
 * @example
 * validateSortOrder('asc');
 * // 'asc'
 * @example
 * validateSortOrder('desc');
 * // 'desc'
 */
export function validateSortOrder(order) {
  const allowedSortOrders = new Set(['asc', 'desc']);
  if (typeof order !== 'string' || !allowedSortOrders.has(order)) {
    throw new TypeError('sortOrder must be one of: asc, desc');
  }

  return order;
}

/**
 * Validate creation payload shape and normalize values.
 * @param {{title: string, description?: string, status?: string, priority?: string}} payload - Creation input.
 * @returns {{title: string, description: string, status: string, priority: string}} Normalized payload.
 * @throws {TypeError} When payload is not a plain object or fields are invalid.
 * @example
 * validateTaskInput({ title: 'Write docs' });
 * // { title: 'Write docs', description: '', status: 'todo', priority: 'medium' }
 * @example
 * validateTaskInput({ title: 'Fix bug', priority: 'high' });
 * // { title: 'Fix bug', description: '', status: 'todo', priority: 'high' }
 */
export function validateTaskInput(payload) {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new TypeError('task input must be a plain object');
  }

  const normalizedTitle = normalizeTitle(payload.title);
  const normalizedDescription = normalizeDescription(payload.description);
  const status = payload.status === undefined ? 'todo' : validateStatus(payload.status);
  const priority = payload.priority === undefined ? 'medium' : validatePriority(payload.priority);

  return {
    title: normalizedTitle,
    description: normalizedDescription,
    status,
    priority
  };
}

/**
 * Validate update payload shape and normalize allowed values.
 * @param {{title?: string, description?: string, status?: string, priority?: string}} updates - Update input.
 * @returns {{title?: string, description?: string, status?: string, priority?: string}} Normalized updates.
 * @throws {TypeError} When payload is invalid or no updatable fields are provided.
 * @example
 * validateTaskUpdates({ status: 'done' });
 * // { status: 'done' }
 * @example
 * validateTaskUpdates({ title: 'Refined title', priority: 'low' });
 * // { title: 'Refined title', priority: 'low' }
 */
export function validateTaskUpdates(updates) {
  if (typeof updates !== 'object' || updates === null || Array.isArray(updates)) {
    throw new TypeError('updates must be a plain object');
  }

  const allowedFields = ['title', 'description', 'status', 'priority'];
  const normalizedUpdates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      if (field === 'title') {
        normalizedUpdates.title = normalizeTitle(updates.title);
      }

      if (field === 'description') {
        normalizedUpdates.description = normalizeDescription(updates.description);
      }

      if (field === 'status') {
        normalizedUpdates.status = validateStatus(updates.status);
      }

      if (field === 'priority') {
        normalizedUpdates.priority = validatePriority(updates.priority);
      }
    }
  }

  if (Object.keys(normalizedUpdates).length === 0) {
    throw new TypeError('at least one updatable field is required: title, description, status, priority');
  }

  return normalizedUpdates;
}
