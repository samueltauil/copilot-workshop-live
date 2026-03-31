# Task Manager CLI – Project Plan

## Project Overview

Task Manager CLI is a command-line task management application built on Node.js 20+ using only built-in modules. Users can create, read, update, and delete tasks with support for filtering and sorting by status and priority. Data is stored in memory for the session. The application provides a lightweight, zero-dependency tool for tracking todos, work in progress, and completed items.

## User Stories

1. **As a user, I want to create a new task so that I can add items to track.**
   - Acceptance criteria:
     - User can provide a title (required) and description (optional).
     - System auto-generates a unique ID using `crypto.randomUUID()`.
     - System sets status to `todo` and priority to `medium` by default.
     - System records creation timestamp in ISO 8601 format.
     - User receives confirmation with the created task details.

2. **As a user, I want to list all tasks so that I can see everything I'm tracking.**
   - Acceptance criteria:
     - System displays all tasks with ID, title, description, status, priority, and timestamps.
     - User can run this command at any time without arguments.
     - Output is formatted as a readable table or JSON.
     - Empty task list is handled gracefully.

3. **As a user, I want to filter tasks by status so that I can focus on work in a specific state.**
   - Acceptance criteria:
     - User can filter to show only `todo`, `in-progress`, or `done` tasks.
     - System returns only matching tasks.
     - Invalid status values are rejected with a clear error message.

4. **As a user, I want to filter tasks by priority so that I can focus on urgent work.**
   - Acceptance criteria:
     - User can filter to show only `low`, `medium`, or `high` priority tasks.
     - System returns only matching tasks.
     - Invalid priority values are rejected with a clear error message.

5. **As a user, I want to update a task so that I can change its title, status, priority, or description.**
   - Acceptance criteria:
     - User provides a task ID and the fields to update.
     - System validates that the task ID exists.
     - System updates only provided fields, leaving others unchanged.
     - System updates the `updatedAt` timestamp.
     - User receives confirmation with the updated task.

6. **As a user, I want to delete a task so that I can remove items I no longer need to track.**
   - Acceptance criteria:
     - User provides a task ID to delete.
     - System validates that the task ID exists.
     - System removes the task from the list.
     - User receives confirmation of deletion.

7. **As a user, I want to sort tasks by priority so that high-priority items appear first.**
   - Acceptance criteria:
     - User can request sorting by priority (high → medium → low).
     - System returns tasks in the sorted order.

8. **As a user, I want to sort tasks by creation date so that I can see newest or oldest items first.**
   - Acceptance criteria:
     - User can request sorting by creation date in ascending or descending order.
     - System returns tasks in the sorted order.

## Data Model

### Task Entity

| Property | Type | Details |
|----------|------|---------|
| `id` | `string` | Unique identifier generated with `crypto.randomUUID()` |
| `title` | `string` | Required, non-empty |
| `description` | `string` | Optional, defaults to empty string |
| `status` | `string` | One of `todo`, `in-progress`, `done`; defaults to `todo` |
| `priority` | `string` | One of `low`, `medium`, `high`; defaults to `medium` |
| `createdAt` | `string` | ISO 8601 timestamp, set at creation |
| `updatedAt` | `string` | ISO 8601 timestamp, updated on any modification |

### In-Memory Storage

- All tasks stored in a single array in memory.
- Array persists for the duration of the process.
- Session-only; does not persist between runs.

## File Structure

```
src/
├── cli.js              # Entry point; parses commands and routes to handlers
├── taskManager.js      # Core TaskManager class with CRUD and filter/sort logic
├── inputValidator.js   # Validates task data and command arguments
└── formatter.js        # Formats output (table or JSON)

docs/
└── project-plan.md     # This file

exercises/
├── 01-prompt-engineering/
│   ├── README.md
│   └── starter.js
└── [other exercises]
```

## Implementation Phases

### Phase 1: Core Data Management (Milestone 1)
**Goal:** Implement the `TaskManager` class with in-memory storage.

- Create `TaskManager` class with internal task array.
- Implement `addTask(title, description)` to create and store tasks.
- Implement `getTaskById(id)` to retrieve a single task.
- Implement `getAllTasks()` to retrieve all tasks.
- Implement `updateTask(id, updates)` to modify task properties.
- Implement `deleteTask(id)` to remove a task.
- Implement `validateTaskData()` helper to ensure data integrity.

**Deliverables:**
- `src/taskManager.js` with full TaskManager class.
- Unit validation for all methods.

---

### Phase 2: Filtering and Sorting (Milestone 2)
**Goal:** Add query capabilities to retrieve tasks under various conditions.

- Implement `filterByStatus(status)` to return tasks matching a status.
- Implement `filterByPriority(priority)` to return tasks matching a priority.
- Implement `sortByPriority(tasks)` to arrange tasks by priority (high first).
- Implement `sortByDate(tasks, order)` to arrange tasks by creation date (ascending/descending).
- Implement `chain()` pattern or separate query builder for combining filters and sorts.

**Deliverables:**
- Extensions to `src/taskManager.js`.
- Usage examples in comments.

---

### Phase 3: Input Validation and CLI Parsing (Milestone 3)
**Goal:** Parse command-line arguments and validate user input.

- Create `src/inputValidator.js` with validation functions.
- Validate task properties before creating or updating tasks.
- Validate filter and sort parameters.
- Create `src/cli.js` with command router.
- Define command syntax (e.g., `node src/cli.js create`, `node src/cli.js list --filter-status done`).
- Parse command-line arguments using `process.argv`.

**Deliverables:**
- `src/inputValidator.js` with validation helpers.
- `src/cli.js` with command routing.
- Error messages for invalid input.

---

### Phase 4: Output Formatting and Display (Milestone 4)
**Goal:** Format and display task data in a user-friendly manner.

- Create `src/formatter.js` to generate human-readable output.
- Implement table formatter (ASCII or JSON lines).
- Implement JSON formatter for structured output.
- Display appropriate headers and summaries.
- Handle edge cases (empty lists, missing properties).

**Deliverables:**
- `src/formatter.js` with table and JSON formatters.
- Consistent, readable output across all commands.

---

### Phase 5: Integration and Testing (Milestone 5)
**Goal:** Wire all components together and validate end-to-end workflows.

- Integrate TaskManager, CLI, validators, and formatters.
- Test all CRUD operations.
- Test filtering and sorting with various combinations.
- Test error handling and edge cases.
- Document CLI commands and usage.

**Deliverables:**
- Fully functional Task Manager CLI.
- Integration tests or manual test cases.
- Usage documentation or help text.

---

## Error Handling Conventions & Input Validation Rules

### Error Classes

The application uses consistent error handling with the following error types:

| Error Type | Cause | Exit Code | Message Format |
|----------|-------|-----------|-----------------|
| `ValidationError` | Invalid input data | 1 | `Error: [field]: [specific issue]` |
| `NotFoundError` | Task ID does not exist | 2 | `Error: Task [id] not found` |
| `InvalidCommandError` | Unknown or malformed CLI command | 3 | `Error: Unknown command '[cmd]'. Use --help for usage.` |
| `InvalidArgumentError` | Invalid command-line argument | 4 | `Error: Invalid argument [arg]: [reason]` |

### Input Validation Rules

#### Task Creation (`create` command)

| Field | Rules |
|-------|-------|
| `title` | Required; non-empty string; max 200 characters; no leading/trailing whitespace |
| `description` | Optional; if provided, max 1000 characters; defaults to empty string |
| `status` | Not user-settable on creation; defaults to `todo` |
| `priority` | Not user-settable on creation; defaults to `medium` |

**Example error:** `Error: title: Title is required and must be between 1 and 200 characters`

#### Task Update (`update` command)

| Field | Rules |
|-------|-------|
| `id` | Required; must match an existing task ID (UUID format) |
| `title` | Optional; if provided, non-empty string; max 200 characters |
| `description` | Optional; if provided, max 1000 characters; can be empty string to clear |
| `status` | Optional; must be one of `todo`, `in-progress`, `done` if provided |
| `priority` | Optional; must be one of `low`, `medium`, `high` if provided |

**Example error:** `Error: status: Invalid status 'pending'. Must be one of: todo, in-progress, done`

#### Task Deletion (`delete` command)

| Field | Rules |
|-------|-------|
| `id` | Required; must match an existing task ID |

**Example error:** `Error: Task a1b2c3d4-e5f6-7890-abcd-ef1234567890 not found`

#### Filtering and Sorting

| Parameter | Rules |
|-----------|-------|
| `--filter-status` | Optional; must be one of `todo`, `in-progress`, `done` |
| `--filter-priority` | Optional; must be one of `low`, `medium`, `high` |
| `--sort-by` | Optional; must be one of `priority`, `date` |
| `--sort-order` | Optional; must be one of `asc`, `desc`; default is `asc` for date, descending for priority |

**Example error:** `Error: Invalid filter value 'urgent' for --filter-priority. Must be one of: low, medium, high`

### Validation Logic Location

- **Pre-storage validation:** `src/inputValidator.js` validates all incoming data before TaskManager operations.
- **Pre-display validation:** `src/cli.js` validates command arguments before delegating to TaskManager.
- **Defensive checks:** TaskManager methods perform final validation to prevent invalid state (defense in depth).

### Edge Cases and Handling

| Scenario | Behavior |
|----------|----------|
| Empty task list | Display message "No tasks found." with exit code 0 |
| Task list after filtering returns no matches | Display message "No tasks match the filter." with exit code 0 |
| User provides both `--filter-status` and `--filter-priority` | Apply both filters (AND logic); return tasks matching both criteria |
| User provides invalid JSON or syntax in any input | Display `ValidationError` with description of the parsing issue |
| User updates a task with no fields specified | Display message "No fields specified for update." without modifying the task |
| Update operation encounters a conflict (e.g., task deleted mid-session) | Display `NotFoundError` for that task ID |

### Success Message Format

All successful operations return a consistent format:

```
✓ [Operation] successful
[Details or task preview]
```

**Examples:**
```
✓ Task created successfully
ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
Title: Buy groceries
Priority: medium
Status: todo
```

```
✓ Task deleted successfully
Removed: Buy groceries (ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890)
```

---

## Success Criteria

- ✓ All CRUD operations work correctly in memory.
- ✓ Filtering by status and priority returns correct subsets.
- ✓ Sorting by priority and date produces expected order.
- ✓ Invalid inputs are rejected with helpful error messages.
- ✓ Tasks persist throughout a single session.
- ✓ Output is formatted clearly and consistently.
- ✓ All validation rules are enforced consistently across CLI and TaskManager.
- ✓ Error messages are actionable and include valid options when applicable.
- ✓ No external dependencies; only built-in Node.js modules used.
- ✓ Application runs on Node.js 20 or later.
