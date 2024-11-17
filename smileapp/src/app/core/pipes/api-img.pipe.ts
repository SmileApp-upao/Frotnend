import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environments'
@Pipe({
  name: 'apiImg',
  standalone: true
})
export class ApiImgPipe implements PipeTransform {

  transform(path:string): string {
    return `${environment.baseURL}/publications/file/${path}`;
  }

}
