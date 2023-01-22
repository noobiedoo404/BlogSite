import { Component, OnInit, Input ,HostListener} from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { SearchPipe } from '../pipes/search.pipe';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SearchHashtagPipe } from '../pipes/search-hashtag.pipe';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css',]
})
export class HeaderComponent implements OnInit {
  public searchInput:string='';
  public searchResult:[]=[];
  public allBlogs:any=[];
  public allUsers:any=[];
  userInfo:any={};
  user_id=localStorage.getItem('user_id');
  public hashtags:any=[];
  show=true;

  @HostListener('document:click', ['$event'])
  clickout() {
     this.show = false;
  }


  loggedIn=false;
  signedUp=false;
  constructor(public _apiService:ApiService, public _authService:AuthService, public _router:Router) { }

  ngOnInit(): void {
    console.log("from header component");

    this._apiService.getHashtags().subscribe(
      res => { 
        for (let index = 0; index < res.data.length; index++) {
          // const element = array[index];
          this.hashtags.push(res.data[index].hashtag);
          
        }
      console.log('hashtags from db are');
      
        console.log(this.hashtags);
        

       }, err => {
        console.log(err);
      })
    
    // this.allBlogTitles=this._apiService.allBlogTitles;

    // this.allUsernames=this._apiService.allUsernames;
    const blogs=this._apiService.getblogs().subscribe(
      res => { 
        this.allBlogs=res.data;
      
        // console.log(this.allBlogTitles);
        

       }, err => {
        console.log(err);
      })
      const users=this._apiService.getAllUsers().subscribe(
        res => { 
          // for (let index = 0; index < res.length; index++){
  
          //   this.allUsernames.push(res[index].user_name);
            
          // }
          this.allUsers=res.data;
          console.log('users for searching');
          
          console.log(this.allUsers);
        })

        console.log(this.user_id);
    console.log(localStorage.getItem("user_id"));
    
    
     this._apiService.getUserInfo(this.user_id).subscribe(
      res=>{ this.userInfo=res.data[0];
      }
      ) 
    
  }

  gotoProfile(){
    this._apiService.gotoProfile().subscribe(
      res => {
        this._router.navigate(['/profile'])
      },
      err => {
        if (err instanceof HttpErrorResponse)
          if (err.status === 401) {
            console.log('error found!');
            
            this._router.navigate(['/login'])
          }
      }
    )
    this._router.navigate(['/profile']);
  }

  gotoWriteBlogPage(){
    this._apiService.getWriteblogPage()
      .subscribe(
        res => {
          this._router.navigate(['/writeblog'])
        },
        err => {
          if (err instanceof HttpErrorResponse)
            if (err.status === 401) {
              console.log('error found!');
              
              this._router.navigate(['/login'])
            }
        }
      )
  }

  gotoHashtag(hashtag:string){
    console.log('chooseType clicked');
    this._router.navigate(['search/',hashtag]);
    
  }
  gotoUser(username:string){
    if(username==this.userInfo.user_name){
      this._router.navigate(['/profile'])
    }
    else{
      this._router.navigate(['',username]);
    }
  }
  clickit(){
    this.show = true;
    }


  

}
