import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addTask, getTasks, updateTask, deleteTask } from '../actions/ToDoActions';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TodoService } from '../services/todo.service';

@Injectable()
export class ToDoEffect {
  constructor(
    private actions: Actions,
    private toDoService: TodoService) {}

  loadTasks$ = createEffect(() =>
    this.actions.pipe(
      ofType(getTasks),
      switchMap(action => {
        const tasksLoaded = this.toDoService.getTasks();
        return of({ type: '[to-do] load tasks', tasks: tasksLoaded });
      }),
      catchError(error => of({ type: '[to-do] error task', message: error }))
    )
  );

  addTask$ = createEffect(() =>
    this.actions.pipe(
      ofType(addTask),
      switchMap(action => {
        this.toDoService.addTask(action.description);

        const tasksLoaded = this.toDoService.getTasks();
        return of({ type: '[to-do] load tasks', tasks: tasksLoaded });
      }),
      catchError(error => of({ type: '[to-do] error task', message: error }))
    )
  );

  updateTask$ = createEffect(() =>
    this.actions.pipe(
      ofType(updateTask),
      switchMap(action => {
        this.toDoService.updateTask(action.toggle, action.tasks);
        const tasksLoaded = this.toDoService.getTasks();
        return of({ type: '[to-do] update tasks', tasks: tasksLoaded });
      }),
      catchError(error => of({ type: '[to-do] error task', message: error }
      ))
    ),
    { dispatch: false }
  );

  deleteTask$ = createEffect(() =>
    this.actions.pipe(
      ofType(deleteTask),
      switchMap(action => {
        this.toDoService.deleteTask(action.task);
        const tasksLoaded = this.toDoService.getTasks();
        return of({ type: '[to-do] load tasks', tasks: tasksLoaded });
      }),
      catchError(error => of({ type: '[to-do] error task', message: error }))
    )
  );

}
