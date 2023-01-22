import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,ParamMap } from '@angular/router';
import dateFormat, { masks } from "dateformat";
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-var-user',
  templateUrl: './var-user.component.html',
  styleUrls: ['./var-user.component.css']
})
export class VarUserComponent implements OnInit {
  target = -1;
  followersLength = 0;
  followingsLength = 0;
  followButton = null;
  followingButton = null;

  text:string='';
  comments:any[]=[];
  noblog=false;
  pointer1=true;
  pointer2=false;
  pointer3=false;
  noBlogFound =false;
  public username:any;
  userInfo:any={};
  public blogs: any={};
  closeResult = '';
  public StrBlog='';
  // public blogs: any[]=[];
  public users: any[]=[];
  public FourUsers: any[]=[];
  // public i:number=4;
  public j:number=0;
  MoreUsers=true;
  public followers: any={};
  followings: any={};
  following: boolean = false;
  followingsArray: any=[];
  followersArray: any=[];
  blogsArray: any=[];
  YourFollowings: any=[];
  your_user_id:any=localStorage.getItem('user_id');
  filename:any;
  filepath="http://localhost:8080/profileImages/";
  youfollow:boolean=false;
  private sub:any;
  blogArray: any=[];
  // _user_id: number;
  userdata = { user_name: '', user_id: null, profile_photo: '', index: null };

  constructor(private _route:ActivatedRoute, private _apiService:ApiService,private _router:Router) {}
  
  ngOnInit(): void { 
    
    this.sub=this._route.paramMap.subscribe(
      (param:ParamMap)=>{
        this.username=param.get('username');
        this.blogs={}
        this._apiService.getUserInfoByUsername(this.username).subscribe(
          res=>{
            this.userInfo=res.data[0];
            console.log('userinfo is');
            console.log(this.userInfo);
            this._apiService.getUserBlogs(this.userInfo.user_id).subscribe(
              res => {
                if(res.data=='No blog found'){
                  this.noblog=true;
                }else{
                  console.log('vars blogs are');
                  console.log(res.data);
                  
                  
                  for (let index = 0; index < res.data.length; index++) {
                    // console.log(res.data[index].blog_id);
                    
                    this.blogs[res.data[index].blog_id]=res.data[index];
                    this.blogs[res.data[index].blog_id]['likedby']=false;
                    this.blogs[res.data[index].blog_id]['canComment']=false;
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
                  // console.log('likedposts are');
                  // console.log(this.likedPosts);
                  this._apiService.getVarPostYouLiked(this.userInfo.user_id).subscribe(
                    res=>{
                      console.log('response from varslikedposts');
                      console.log(res.data);
                      if(res.data!='No blog found'){
                        for (let index = 0; index < res.data.length; index++) {
                          // const element = array[index];
                          console.log('want it now');
                          console.log(this.blogs);
                          
                          console.log();
                          
                          
                          this.blogs[res.data[index].blog_id].likedby=true;
                        }
                        
                      }
                      this.blogArray=Object.values(this.blogs)
                        console.log('againg blogs array:');
                        ;
                        console.log(this.blogArray);
                      
                    }
                  )
                }
                
 
        
              })
          
            }
        )

        
      }
    )
    
    
  }


  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }

  //getting followings for profile user
  getFollowingsForProfileUser(){
    this._apiService.getFollowings(this.your_user_id).subscribe(
      res => { 
        console.log('followings from getfollowings');

        console.log('partha b is checking');
        this.YourFollowings = res.data;
        console.log('followings of yours');
        console.log(this.YourFollowings);

      }, err => {
        console.log(err);
      })
  }

  //getting followers for var user
  getFollowersForVarUser(){
    this._apiService.getFollowings(this.your_user_id).subscribe(
      res => { 
        console.log('followings from getfollowings');

        console.log('partha b is checking');
        this.YourFollowings = res.data;
        console.log('followings of yours');
        console.log(this.YourFollowings);

        this._apiService.getFollowers(this.userInfo.user_id).subscribe(
          res => { 
            console.log('res data');
            console.log(res);
            // this.followers=res.data;
              // console.log(this.followers);
    
              for (let index = 0; index < res.data.length; index++) {
                // console.log(index);
                this.followers[res.data[index].user_id] = res.data[index];
                this.followers[res.data[index].user_id].youfollow = false;
                // this.followers.push(res.data[index])
              }
    
              console.log('look at this');
              
              console.log(this.followers);
              
              for (let index = 0; index < this.YourFollowings.length; index++){
                // console.log(index);
                try {
                  
                  // console.log(this.YourFollowings[index].user_id);
                  this.followers[this.YourFollowings[index].user_id].youfollow=true;
                } catch (error) {
                  console.log(this.userInfo.user_name+' doesnt follow '+this.YourFollowings[index].user_id);
                  
                }
    
              }
              if (this.your_user_id in this.followers){
                this.followers[this.your_user_id].youfollow=true; 
              }
              // this.followers.push(Object.values(res.data));
        
              console.log('followers of var');
    
              this.followersArray=Object.values(this.followers);
              
              console.log(this.followersArray);
              // console.log(index) 
              
              
              this._apiService.getFollowings(this.userInfo.user_id).subscribe(
                res => { 
                  
                  console.log('followings are here');
                  // this.followings=res.data;
                    console.log(this.followings);
          
                    for (let index = 0; index < res.data.length; index++) {
                      // console.log(index);
                      this.followings[res.data[index].user_id] = res.data[index];
                      this.followings[res.data[index].user_id]['youfollow'] = false;
                      // this.followers.push(res.data[index])
                    }
                    console.log('followings data');
                    console.log(this.followings);
                    
                    for (let index = 0; index < this.YourFollowings.length; index++){
                      // console.log(index);
                      
                      // this.followings[this.YourFollowings[index].user_id].youfollow=true;
                      try {
                        
                        // console.log(this.YourFollowings[index].user_id);
                        this.followings[this.YourFollowings[index].user_id].youfollow=true;
                      } catch (error) {
                        console.log(this.userInfo.user_name+' doesnt follow '+this.YourFollowings[index].user_id);
                        
                      }
                      
                    }
          
                    console.log('your user id is');
                    
                    console.log(this.your_user_id);
                    console.log('following is');
                    console.log(this.followings);
                    
                    
                    
                    if (this.your_user_id in this.followings){
                      this.followings[this.your_user_id].youfollow=true; 
                    }
                    // this.followers.push(Object.values(res.data));
              
                    console.log('following array of var');
                    this.followingsArray=Object.values(this.followings);
                    console.log(this.followingsArray);
                    // console.log(index)  
                    
              
                 }, err => {
                  console.log(err);
                })
        
           }, err => {
            console.log(err);
          })

      }, err => {
        console.log(err);
      })
    // this.followers={};
    
  }

  //gettng followings for var user
  getFollowingsForVarUser(){
    this._apiService.getFollowings(this.your_user_id).subscribe(
      res => { 
        console.log('followings from getfollowings');

        console.log('partha b is checking');
        this.YourFollowings = res.data;
        console.log('followings of yours');
        console.log(this.YourFollowings);

        this._apiService.getFollowings(this.userInfo.user_id).subscribe(
          res => { 
            
            console.log('followings are here');
            // this.followings=res.data;
              console.log(this.followings);
    
              for (let index = 0; index < res.data.length; index++) {
                // console.log(index);
                this.followings[res.data[index].user_id] = res.data[index];
                this.followings[res.data[index].user_id]['youfollow'] = false;
                // this.followers.push(res.data[index])
              }
              console.log('followings data');
              console.log(this.followings);
              
              for (let index = 0; index < this.YourFollowings.length; index++){
                // console.log(index);
                
                // this.followings[this.YourFollowings[index].user_id].youfollow=true;
                try {
                  
                  // console.log(this.YourFollowings[index].user_id);
                  this.followings[this.YourFollowings[index].user_id].youfollow=true;
                } catch (error) {
                  console.log(this.userInfo.user_name+' doesnt follow '+this.YourFollowings[index].user_id);
                  
                }
                
              }
    
              console.log('your user id is');
              
              console.log(this.your_user_id);
              console.log('following is');
              console.log(this.followings);
              
              
              
              if (this.your_user_id in this.followings){
                this.followings[this.your_user_id].youfollow=true; 
              }
              // this.followers.push(Object.values(res.data));
        
              console.log('following array of var');
              this.followingsArray=Object.values(this.followings);
              console.log(this.followingsArray);
              // console.log(index)  
              
        
           }, err => {
            console.log(err);
          })

      }, err => {
        console.log(err);
      })
    
    
  }

  

//  follow(others_id:any,event:any){
//   console.log('follow button clicked!');
//   console.log(event);
  
  
//   console.log(others_id);                                                               

//     if(this._apiService.user_id!=null){
//       this._apiService.follow(others_id).subscribe();
//       event.target.hidden = true;
      
//     }
//     else{
//       this._router.navigate(['/login'])
//     }
//  }
 public follow(others_id: any, index: any) {
  console.log('follow button clicked!');
  console.log(others_id);
  console.log('youfollow of followingsArray at index '+index+' is ');
  console.log(this.followingsArray);

  if(this._apiService.user_id!=null){
    this.followingsArray[index].youfollow = true;
  this._apiService.follow(<number>others_id).subscribe();
  this.target = -1;
  this.followingButton = others_id;
  this.followingsLength += 1;
  }
  else{
    this._router.navigate(['/login']).then(()=>{

      window.location.reload()
    }
    )
  }
  
  
  
}
 unfollow(others_id: any, index: any) {

  console.log("you are no longer following ");
  console.log(others_id);
  this.followingsArray[index].youfollow = false;

  this.target = others_id;

  this._apiService.unfollow(others_id).subscribe(
    res => console.log(res)
  )
  this.followingsLength -= 1;


}

public followback(others_id: any, index:any) {
  console.log('follow button clicked!');
  console.log(others_id);
  this._apiService.follow(others_id).subscribe();
  // this.fo
  this.followersArray[index].isFollowing=true;
  // event.target.hidden = true;
  // this.followersLength += 1;
}



//  func1(variable:string):boolean{
//   this._apiService.getUserBlogsByUserName(variable).subscribe(
//     res=>{
//     for (let index = 0; index < res.length; index++) {
//       this.userDetails.push(Object.values(res[index]));
//     }
//     this._user_id=this.userDetails[0][1]
//     console.log('user id is',this._user_id);
    
    
//   }
//   )
//   return true;
//  }

gotoUser(username:string,id:any){
  console.log(username);
  console.log(this.username);
  
  
  if(id==this.your_user_id){
    this._router.navigate(['/profile'])
  }
  else{
    this._router.navigate(['',username]).then(() => {
      window.location.reload();
    });
  }
  
  
}
enableDisableRule(a:boolean,b:boolean,c:boolean) {
  this.pointer1 = a;
  this.pointer2 = b;
  this.pointer3 = c;
  // this.status = this.toggle ? 'Enable' : 'Disable';
}


gotoUnfollowModal(a: any, b: any, c: any, index: any) {
  this.userdata.user_id = a;
  this.userdata.user_name = b;
  this.userdata.profile_photo = c;
  this.userdata.index = index;
  console.log('userdata is');
  console.log(this.userdata);
}

ShowMoreUsers(){
  while(this.FourUsers.length){
    this.FourUsers.pop();
  } 

  let i=this.j;
  for (let index = this.j; index < 4+i&& index<this.users.length; index++,this.j++){
    this.FourUsers.push(this.users[index]);
  }
  console.log("j value is-"+this.j);
  // console.log("i value is-"+this.i);
  
  if(this.j==this.users.length){this.MoreUsers=false}
}
BackToTop(){
while(this.FourUsers.length){
  this.FourUsers.pop();
} 
this.j=0;
// this.i=0;
if(this.users.length<4){
  for (let index = 0; index < this.users.length; index++,this.j++){
    this.FourUsers.push(this.users[index])
  }
  this.MoreUsers=false;
}
else{
  for (let index = 0; index < 4; index++,this.j++){
    this.FourUsers.push(this.users[index])
  }
  this.MoreUsers=true;
}    
}



// follow(others_id:any){
// console.log(others_id);
// if(this._apiService.user_id!=null){
//   this._apiService.follow(others_id).subscribe();
//   this.target=others_id;
//   console.log("target is:"+this.target);
// }
// else{
//   this._router.navigate(['/login'])
// }

// }



// unfollow(others_id:any){
// console.log(others_id);
// this.clicked=false;
// this.target=-1;
// this._apiService.unfollow(others_id).subscribe(
//   res=>console.log(res)
// )
// }



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

// gotoUser(username:string){
// this._router.navigate(['',username]);
// }

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
