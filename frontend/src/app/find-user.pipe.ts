import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findUser'
})
export class FindUserPipe implements PipeTransform {

  transform(followings: string[], searchInput: string): boolean {
    if(followings.includes(searchInput))
    return true;
    return false;
  }

}
