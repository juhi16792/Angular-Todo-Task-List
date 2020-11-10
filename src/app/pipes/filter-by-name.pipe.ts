import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByName'
})
export class FilterByNamePipe implements PipeTransform {

  transform(listOfTasks: any[], nameToFilter: string): string[] {
    if (!listOfTasks) { return null; }
    if (!nameToFilter) { return listOfTasks; }

    return listOfTasks.filter(n => n.description.indexOf(nameToFilter) >= 0);
  }

}
