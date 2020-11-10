import { createAction, props } from '@ngrx/store';
import { ToDo } from '../models/todo.model';

export const getTasks = createAction('[to-do] get tasks');

export const loadTasks = createAction(
  '[to-do] load tasks',
  props<{ tasks: ToDo[] }>()
);

export const addTask = createAction(
  '[to-do] add task',
  props<{ description: string }>()
);

export const updateTask = createAction(
  '[to-do] update tasks',
  props<{ toggle: ToDo, tasks: ToDo[] }>()
);

export const deleteTask = createAction(
  '[to-do] delete task',
  props<{ task: ToDo }>()
);

export const errorTask = createAction(
  '[to-do] error task',
  props<{ message: string }>()
);
