import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'count',
  standalone: true
})
export class CountPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): String {
    if (typeof value === "number") {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return "(error)";
  }

}
