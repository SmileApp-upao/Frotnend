import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortCitas',
  standalone:true
})
export class SortCitasPipe implements PipeTransform {
  transform(citas: any[]): any[] {
    return citas.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.hour}`).getTime();
      const dateB = new Date(`${b.date}T${b.hour}`).getTime();
      return  dateB-dateA;
    });
  }
}