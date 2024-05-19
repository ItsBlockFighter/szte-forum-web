import {Pipe, PipeTransform} from '@angular/core';
import {Timestamp} from '@angular/fire/firestore';
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'timestamp',
  standalone: true
})
export class TimestampPipe implements PipeTransform {

  private datePipe: DatePipe = new DatePipe('en-US');

  transform(value: unknown, ...args: unknown[]): String {
    if (value instanceof Timestamp) {
      const date = value.toDate();
      return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss') || "(error)";
    }

    return "(error)";
  }
}
