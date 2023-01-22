import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchBlog'
})
export class SearchBlogPipe implements PipeTransform {

  transform(array: any, searchInput: string): any[] {
    console.log('all blogs from pipe function');
    console.log(array);

    console.log('search input is',searchInput);
    
      
    if(!searchInput) {
        return  [];
    }
   searchInput = searchInput.toLowerCase();
    const ans:any=[];
    
   for (let index = 0; index < array.length; index++) {
    
    console.log('hashtags are');
    console.log(array);
    
    
    if(array[index].includes(searchInput)){
      ans.push(array[index]);
    }
    
   }
  //  return blogs.filter(
  //      x =>x.toLowerCase().includes(searchInput)
  //  )
  console.log('ans is');
  
  console.log(ans);
  
  return ans;
  }

}
