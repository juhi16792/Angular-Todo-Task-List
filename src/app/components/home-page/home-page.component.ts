import { OnInit, AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTodoDialogComponent } from '../../components/add-todo-dialog/add-todo-dialog.component';
import { TodoService } from '../../services/todo.service';
import { Store, select } from '@ngrx/store';
import { CdkDragRelease, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {FormControl} from '@angular/forms';
import { getTasks, addTask, updateTask, deleteTask } from '../../actions/ToDoActions';
import { selectTasks, selectError } from '../../reducers/ToDoReducers';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent implements OnInit, AfterViewInit {
  allTasks: any = [];
  todo: any = [];
  done: any = [];
  myControl = new FormControl();
  filterName: string;

  items$: any;
  error$: any;

  lockAxis: any;
  @ViewChild('resizeBox') resizeBox: ElementRef;
  @ViewChild('dragHandleRight') dragHandleRight: ElementRef;
  @ViewChild('dragHandleBottom') dragHandleBottom: ElementRef;

  constructor(
    private ngZone: NgZone,
    public dialog: MatDialog,
    private store: Store<any>
    ) {
      this.store.dispatch(getTasks());
      // this.items$ = this.store.pipe(select(selectTasks));
      this.error$ = this.store.pipe(select(selectError));

      store.pipe(select(selectTasks)).subscribe(allTasks => {
        // Distill the payload and filter them by todo, done.
        this.allTasks = allTasks || [];
        this.todo = this.allTasks.filter(t => !t.done);
        this.done = this.allTasks.filter(t => t.done);

        // Sort in ascending order of each list.
        this.todo.sort(this.dynamicSort('order', 'asc'));
        this.done.sort(this.dynamicSort('order', 'asc'));
      });
    }

    ngOnInit() {
      this.getTodos();
    }

    ngAfterViewInit() {
      this.setAllHandleTransform();
    }

    openAddTodoDialog() {
      const dialogRef = this.dialog.open(AddTodoDialogComponent, {
        width: '70vw',
        data: {}
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getTodos();
      });
    }

    getTodos() {
      this.store.dispatch(getTasks());
    }

    drop(event: CdkDragDrop<any[]>) {
      let copyOfPrevious: any;
      let isSwapped: boolean;

      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        isSwapped = false;
      } else {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

        // Reference of read only data.
        const previousOriginal = event.previousContainer.data;

        // Map a new copy of event data to bring back to service.
        copyOfPrevious = previousOriginal.map(obj => {
          const rObj: any = {};
          rObj.done = obj.done;
          rObj.description = obj.description;
          rObj.id = obj.id;
          rObj.order = obj.order;
          return rObj;
        });

        // If transfer, recalculate the order of previous (the copied list from drag).
        copyOfPrevious.forEach((x, index) => {
          x.order = index;
        });

        isSwapped = true;
      }

      // Reference of read only data.
      const original = event.container.data;

      // Clone event data for toggle state.
      const toggleOfCopy = event.item.data;
      const taskToToggle = {...toggleOfCopy};

      // Determine if toggling done should occur.
      if (isSwapped) {
        // Toggle done state.
        taskToToggle.done = !taskToToggle.done;
      } else {
        // Let done state pass.
        taskToToggle.done = taskToToggle.done;
      }

      // Map a new copy of event data to bring back to service.
      const copyOfOriginal = original.map(obj => {
        const rObj: any = {};
        rObj.done = obj.done;
        rObj.description = obj.description;
        rObj.id = obj.id;
        rObj.order = obj.order;
        return rObj;
      });

      // Always, recalculate the order of the copied container (the list to drag).
      copyOfOriginal.forEach((x, index) => {
        x.order = index;
      });

      // Create new master list to send for update.
      let consolidatedList;
      if (copyOfPrevious) {
        consolidatedList = copyOfOriginal.concat(copyOfPrevious);
      } else {
        consolidatedList = copyOfOriginal;
      }

      this.store.dispatch(updateTask({
        toggle: taskToToggle,
        tasks: consolidatedList
      }));
    }

    removeTodo(index: number, tasks: any[]) {
      this.store.dispatch(deleteTask({ task: tasks[index] }));
    }

    get resizeBoxElement(): HTMLElement {
      return this.resizeBox.nativeElement;
    }

    get dragHandleRightElement(): HTMLElement {
      return this.dragHandleRight.nativeElement;
    }

    get dragHandleBottomElement(): HTMLElement {
      return this.dragHandleBottom.nativeElement;
    }

    setAllHandleTransform() {
      const rect = this.resizeBoxElement.getBoundingClientRect();
      // this.setHandleTransform(this.dragHandleRightElement, rect, 'x');
      // this.setHandleTransform(this.dragHandleBottomElement, rect, 'y');
    }

    setHandleTransform(
      dragHandle: HTMLElement,
      targetRect: ClientRect | DOMRect,
      position: 'x' | 'y' | 'lockAxis'
    ) {
      const dragRect = dragHandle.getBoundingClientRect();
      const translateX = targetRect.width - dragRect.width;
      const translateY = targetRect.height - dragRect.height;

      if (position === 'x') {
        dragHandle.style.transform = `translate3d(${translateX}px, 0, 0)`;
      }

      if (position === 'y') {
        dragHandle.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }

      if (position === 'lockAxis') {
        dragHandle.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      }
    }

    dragMove(dragHandle: HTMLElement) {
      this.ngZone.runOutsideAngular(() => {
        this.resize(dragHandle, this.resizeBoxElement);
      });
    }

    resize(dragHandle: HTMLElement, target: HTMLElement) {
      const dragRect = dragHandle.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const width = dragRect.left - targetRect.left + dragRect.width;
      const height = dragRect.top - targetRect.top + dragRect.height;

      target.style.width = width + 'px';
      target.style.height = height + 'px';

      this.setAllHandleTransform();
    }

    dynamicSort(property: string, order: string) {
      let sortOrder = 1;
      if (order === 'desc'){
          sortOrder = -1;
      }
      return (a, b) => {
          // a should come before b in the sorted order
          if (a[property] < b[property]){
                  return -1 * sortOrder;
          // a should come after b in the sorted order
          } else if (a[property] > b[property]){
                  return 1 * sortOrder;
          // a and b are the same
          } else {
                  return 0 * sortOrder;
          }
      };
    }
}
