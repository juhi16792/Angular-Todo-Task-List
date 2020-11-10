import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TodoService } from '../../services/todo.service';
import { getTasks, addTask } from '../../actions/ToDoActions';

@Component({
  selector: 'app-add-todo-dialog',
  templateUrl: './add-todo-dialog.component.html',
  styleUrls: ['./add-todo-dialog.component.scss']
})

export class AddTodoDialogComponent {
  todoData: any = {};

  constructor(
    public dialogRef: MatDialogRef<AddTodoDialogComponent>,
    private todoService: TodoService,
    private store: Store<any>
  ) { }

  save(todoForm: NgForm) {
    if (todoForm.invalid) {
      return;
    }
    this.store.dispatch(addTask({ description: this.todoData.description }));
    this.dialogRef.close();
  }

  getTodos() {
    this.store.dispatch(getTasks());

    this.todoService.getTasks().subscribe(() => {
      this.store.dispatch(getTasks());
    });
  }
}
