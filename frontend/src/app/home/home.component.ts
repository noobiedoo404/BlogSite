import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import dateFormat, { masks } from "dateformat";
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  text2="i am a good boy!"
  result:any;
  public StrBlog='';
  public blogs: any={};
  public searchInput:string='';
  public searchResult:[]=[];
  public allBlogTitles:string[]=[];
  public allUsernames:any[]=[];
  public users: any[]=[];
  public fourUsersMax: any=[];
  // public x: [string, number];
  public blogArray:any=[];
  public followings: number[]=[];
  comments:any[]=[];
  target=-1;
  atBegin=false;

  userInfo:any={};
  user_id = localStorage.getItem('user_id');

  // toggle=true;
  pointer1=true;
  pointer2=false;
  pointer3=false;
  // public i:number=4;
  public j:number=0;
  moreUsers=true;
  clicked: boolean=false;
  openCommentSection:string='';
  text:string='';
  targetId=1.5;
  trending=true;
  category=false;
  hashtag='';
  public blogsByHashtag:any=[];
  public MostFollowedUsers:any=[];
  public popularHashtags: any = [];
  noOfBlogs:any;

  //variables for "you can follow more!"

  div1:any=[];
  div2:any=[];
  div3:any=[];
  first_div=1;
  last_div=3;
  div_pointer=1;

 

  constructor(private _apiService: ApiService,private _router:Router) { }

  ngOnInit(): void { 
    

    this._apiService.getUserInfo(this.user_id).subscribe(
      res => {
        this.userInfo = res.data[0];
        console.log('userinfo');
        
        console.log(this.userInfo);
      },
      err => {
        console.log("error getting the userInfo");

      }
    )
    

    this._apiService.getblogs().subscribe(
      res => { 
        // console.log('partha b is checking');
        // console.log(res.data);
        
        this.noOfBlogs=res.data.length;
        for (let index = 0; index < res.data.length; index++) {
          // console.log(res.data[index].blog_id);
          
          this.blogs[res.data[index].blog_id]=res.data[index];
          this.blogs[res.data[index].blog_id]['likedby']=false;
          this.blogs[res.data[index].blog_id]['canComment']=false;
          this.blogs[res.data[index].blog_id]['YouFollowThisUser']=false;
          let string=res.data[index].hashtags;
          if (string.charAt(0)=='#') {
            string=string.substr(1,string.length);
          }
          // this.blogs[res.data[index].blog_id]['hashtags']=res.data[index].category.split("#");
          this.blogs[res.data[index].blog_id]['hashtags']=string.split("#");

        // let key=this.blogs[index][0];
          // this.likedPosts[key]=false;
        }
        // this.blogs=res;
        console.log('blogs are');
        console.log(this.blogs);
        
        //get followings
        this._apiService.getFollowingsId().subscribe(
          res=>{
            if(res.data!=0){
              
              console.log('followings');
              console.log(Object.values(res.data));
              const followings=[];
              for (let index = 0; index < res.data.length; index++) {
                followings.push(res.data[index].user_id);
              }
              console.log(followings);
              
              
              
              const temparray:any=Object.values(this.blogs);
              console.log('temparray');
              console.log(temparray);
              
              console.log(this.noOfBlogs);
              
              for (let index = 0; index < this.noOfBlogs; index++){
                console.log('item if temparray');
                console.log(temparray[index].user_id);
                
                
                if(followings.includes(temparray[index].user_id)){
                  console.log('user id to be checked is-');
                  
                  console.log(temparray[index].user_id);
                  
                  this.blogs[temparray[index].blog_id].YouFollowThisUser=true;
                }
              
              }
              console.log("blogs after adding following details");
              console.log(this.blogs);
    
              
            }
            
          }
    
        )

        this._apiService.getLikedPosts().subscribe(
          res=>{
            console.log('response from likedposts');
            console.log(res);
            
            for (let index = 0; index < res.data.length; index++) {
              // const element = array[index];
              console.log('want it now');
              console.log(this.blogs);
              
              console.log();
              
              
            
              try {
                this.blogs[res.data[index].blog_id].likedby=true;
                
              } catch (error) {
                console.log('error');
                
              }
              
            }
            this.blogArray=Object.values(this.blogs)
            console.log('againg blogs array:');
            ;
            console.log(this.blogArray);
          }
        )



        //get profile users followings
        this._apiService.get12MostFollowedUsers().subscribe(
          res => { 
            this.MostFollowedUsers=res.data;
          console.log('Most followed users');
          
          console.log(this.MostFollowedUsers);
          this._apiService.get12PopularHashtags().subscribe(
            res => {
              this.popularHashtags = res.data;
              console.log('popular hashtags');
              console.log(this.popularHashtags);


            },
            err => {
              console.log(err);

            }
          )
            
      
           }, err => {
            console.log(err);
          })
        

       }, err => {
        console.log(err);
      })
   

    



    
    // const getFollowings=this._apiService.getFollowingsId().subscribe(
    //   res=>{
    //     if(res.data!=0){
    //       console.log('from home ngOnInit showing the followings');
    //       console.log(res.data);
          
          
    //       for (let index = 0; index < res.data.length; index++){
    //         this.followings.push(<number>res.data[index].user_id);
    //       }
    //       console.log("###############from home followings is:");
    //       console.log(this.followings);

          
    //     }
    //   }
    // )
    //

    this._apiService.getUsers().subscribe(
      res => { 
        console.log('heko from getUsers');
        
        this.users=res.data;
        console.log(this.users);
        if(this.users.length==0){
          console.log('length is 0');
          
        }
        else if(this.users.length>8){
          this.first_div=1;
          this.last_div=3;
          console.log('lenght greater than 8');
          
          for (let index = 0; index < 4; index++){
            this.div1.push(this.users[index]);
            this.div1[index]['YouFollowThisUser']=false;
          }
          for (let index = 4; index < 8; index++){

            this.div2.push(this.users[index]);
            this.div2[index-4]['YouFollowThisUser']=false;
          }
          for (let index = 8; index < this.users.length; index++){
            this.div3.push(this.users[index]);
            this.div3[index-8]['YouFollowThisUser']=false;
          }
        }
        else if(this.users.length>4 && this.users.length<=8){
          this.first_div=1;
          this.last_div=2;
          console.log('lenght less than 8');

          for (let index = 0; index < 4; index++){
            this.div1.push(this.users[index]);
            this.div1[index]['YouFollowThisUser']=false;
          }
          for (let index = 4; index < this.users.length; index++){
            this.div2.push(this.users[index]);
            this.div2[index-4]['YouFollowThisUser']=false;
          }
        }
        
        else{ 
          this.first_div=1;
          this.last_div=1;
          console.log('length less than 4');
          
          for (let index = 0; index < this.users.length; index++){
            this.div1.push(this.users[index]);
            this.div1[index]['YouFollowThisUser']=false;
          }
        }
        console.log("div1");
        console.log(this.div1);
        
        console.log("div2");
        console.log(this.div2);

        console.log("div3");
        console.log(this.div3);

         
        }
       , err => {
        console.log(err);
      }) 
    
    
      this._apiService.getBlogsByHashtages(this.hashtag).subscribe(
        res => { 
          this.blogsByHashtag=res.data;
        console.log('blogs by hashtags');
        
          console.log(this.blogsByHashtag);

          
    
         }, err => {
          console.log(err);
        })

      
    
  }

  TargetPrefix(event:any) {
    this.result = window.getSelection()!.toString();
    

    console.log("the clicked word in the string");
    console.log(this.result);
    

}


prev(){
  this.div_pointer-=1;
}
next(){
  this.div_pointer+=1;
}
 

 removeUser(div_pointer:any,index:any){
  if(div_pointer==1){
    this.div1.splice(index,1);
  }
  else if(div_pointer==2){
    this.div2.splice(index,1);
  }
  else{
    this.div3.splice(index,1);
  }
  
 }
 


 follow(others_id:any){
  console.log(others_id);
  if(this._apiService.user_id!=null){
    this._apiService.follow(others_id).subscribe();
    for (let index = 0; index < this.noOfBlogs; index++) {
      if(this.blogArray[index].user_id==others_id){
        this.blogArray[index].YouFollowThisUser=true;
      }
      
    }
    for (let index = 0; index < this.fourUsersMax.length; index++) {
      if(this.fourUsersMax[index].user_id==others_id){
        this.fourUsersMax[index].YouFollowThisUser=true;
      }
      
    }

  }
  else{
    this._router.navigate(['/login'])
  }
  
 }
 follow_2(div_pointer:any,others_id:any,index:any){
  console.log(others_id);
  
  if(this._apiService.user_id!=null){
    this._apiService.follow(others_id).subscribe();
    for (let index = 0; index < this.noOfBlogs; index++) {
      if(this.blogArray[index].user_id==others_id){
        this.blogArray[index].YouFollowThisUser=true;
      }
      
    }
    if(div_pointer==1){
      this.div1[index].YouFollowThisUser=true;
    }
    else if(div_pointer==2){
      this.div2[index].YouFollowThisUser=true;
    }
    else{
      this.div3[index].YouFollowThisUser=true;
    }

  }
  else{
    this._router.navigate(['/login'])
  }
  
 }
 unfollow_2(div_pointer:any,others_id:any,index:any){
  console.log(others_id);
  this._apiService.unfollow(others_id).subscribe(
    res=>console.log(res)
    )
    for (let index = 0; index < this.noOfBlogs; index++) {
      if(this.blogArray[index].user_id==others_id){
        this.blogArray[index].YouFollowThisUser=false;
      }
      
    }
    if(div_pointer==1){
      this.div1[index].YouFollowThisUser=false;
    }
    else if(div_pointer==2){
      this.div2[index].YouFollowThisUser=false;
    }
    else{
      this.div3[index].YouFollowThisUser=false;
    }

 
  
 }



 unfollow(others_id:any){
  console.log(others_id);
  this._apiService.unfollow(others_id).subscribe(
    res=>console.log(res)
    )
    for (let index = 0; index < this.noOfBlogs; index++) {
      if(this.blogArray[index].user_id==others_id){
        this.blogArray[index].YouFollowThisUser=false;
      }
      
    }
    
 }
 


 searchBlog(title:string){
  this._apiService.getblogs()
 }
 
 isNotFollowing(othersId:any){
  // if(localStorage.getItem('user_id')==null)return false;

  this._apiService.isFollowing(othersId).subscribe(
      res=>{ 
        if(res.result==='true')return false;
        return true;
      }
    )
   

}

gotoUser(username:string){
  if(username==this.userInfo.user_name){
    this._router.navigate(['/profile'])
  }
  else{
    this._router.navigate(['',username]);
  }
}

gotoHashtag(hashtag:string){
  console.log('chooseType clicked');
  this._router.navigate(['search/',hashtag]);
  
}

comment(index:number,blog_id:number){
  // this.targetSection=(-1*blog_id);
  // this.targetId=blog_id;
  // this.toggle=!this.toggle;
  // console.log(this.toggle);
  this.blogArray[index].canComment=!this.blogArray[index].canComment;
  
  this._apiService.getComments(blog_id).subscribe(
    res=>{
      this.comments=res.data;
    }
  )
}

addComment(blog_id:any,user_id:any,comment:any){
  console.log("commnet is");
  console.log(comment);
  console.log(blog_id);
  console.log(user_id);
  // let dateFormat = require('dateformat');

let now = new Date();
let jstoday = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM TT");
console.log(jstoday);


  this._apiService.addComment(blog_id,user_id,comment,jstoday).subscribe(
    res => {
      console.log(res)
      this._apiService.getComments(blog_id).subscribe(
        res=>{
          let length=res.data.length;
          for (let index = 0; index < length; index++) {
            this.comments[index]=res.data[length-1-index]
          }
          
        }
      )
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
like(blog_id:any, index:any){
  this._apiService.like(blog_id).subscribe(res=>console.log(res),
  err=>{
  console.log('err is'+ err);
  
    if (err instanceof HttpErrorResponse)
      if (err.status === 401) {
        console.log('error found!');
        
        this._router.navigate(['/login'])
      }
  }
  
  )
  this.blogArray[index].likedby=true;
  this.blogArray[index].likes+=1;
}
unlike(blog_id:any,index:any){
  this._apiService.unlike(blog_id).subscribe(res=>console.log(res))
  this.blogArray[index].likedby=false;
  this.blogArray[index].likes-=1;
}
  
enableDisableRule(a:boolean,b:boolean,c:boolean) {
  this.pointer1 = a;
  this.pointer2 = b;
  this.pointer3 = c;
  // this.status = this.toggle ? 'Enable' : 'Disable';
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
  
}

