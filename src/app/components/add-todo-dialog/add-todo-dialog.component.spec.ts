import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTodoDialogComponent } from './add-todo-dialog.component';

describe('AddTodoDialogComponent', () => {
  let component: AddTodoDialogComponent;
  let fixture: ComponentFixture<AddTodoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTodoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
