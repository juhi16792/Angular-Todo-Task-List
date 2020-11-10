import { MenuReducer } from './menu-reducer';
// import { todoReducer } from './todo-reducer';
import { ToDoReducer } from './ToDoReducers';

export const reducers = {
  menuState: MenuReducer,
  // todos: todoReducer,
  toDo: ToDoReducer
};
