import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(array: any, searchInput: string): any[]{   
    console.log('blogs from pipe function');
    console.log(array);

    console.log('search input is',searchInput);
    
      
    if(!searchInput) {
        return  [];
    }
   searchInput = searchInput.toLowerCase();
    const ans=[];
   for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if(array[index].user_name.toLowerCase().includes(searchInput)){
      ans.push(array[index]);
    }
    
   }
  //  return blogs.filter(
  //      x =>x.toLowerCase().includes(searchInput)
  //  )
  return ans;
 }

}
