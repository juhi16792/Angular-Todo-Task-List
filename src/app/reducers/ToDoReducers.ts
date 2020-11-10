import { loadTasks, errorTask } from '../actions/ToDoActions';
import { on, createReducer } from '@ngrx/store';
import { ToDo } from '../models/todo.model';

export interface State {
  toDo: { tasks: ToDo[]; error: string };
}

export const initialState: State = {
  toDo: { tasks: [], error: '' }
};

export const ToDoReducer = createReducer(
  initialState,
  on(loadTasks, (state, action) => ({
    ...state,
    tasks: action.tasks
  })),
  on(errorTask, (state, action) => ({
    ...state,
    error: action.message
  }))
);

export const selectTasks = (state: State) => state.toDo.tasks;

export const selectError = (state: State) => state.toDo.error;
