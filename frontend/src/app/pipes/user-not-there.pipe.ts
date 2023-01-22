import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userNotThere'
})
export class UserNotTherePipe implements PipeTransform {
  followingsId: any;

  transform(followingsId: number[], searchInput: any): boolean {
    const userid=localStorage.getItem('user_id');
    console.log('user id of searched item is '+searchInput);
    // console.log(searchInput);

    // console.log(this.followingsId.length);
    
    console.log('followingsId array');
    console.log(followingsId);
    //if there is no user logged in.
    if(userid==null){
      console.log('not logged in!');
      return true;
    }  
    
    //when user is logged in.
    else if((''+searchInput)==userid){
      return false;
    }
    


    else
    {
    
      for (let index = 0; index < followingsId.length; index++) {
        console.log('inside for loop');
        
        console.log(followingsId[index]);
        
        if(followingsId[index]==<number>searchInput){
          console.log('search element is'+searchInput);
          
          console.log('compared element in followingsId is '+followingsId[index]);
          // console.log(followingsId);
          
          // console.log('value of the element'+followingsId[index]);
          
          return false;}
        
      }
      return true;
        
  
      
    }
    
  }

}
