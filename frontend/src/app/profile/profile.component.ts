import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import dateFormat, { masks } from "dateformat";
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  closeResult = '';
  text:string='';
  pointer1=true;
  pointer2=false;
  pointer3=false;
  public StrBlog = '';
  public blogs: any={};
  // public users: any[]=[];
  // public FourUsers: any[]=[];
  // public i:number=4;
  public j: number = 0;
  public followers: any={};
  comments:any[]=[];

  followersLength = 0;
  followingsLength = 0;
  followings: any[] = [];
  following: boolean = false;
  // userdata:any[2]=[];
  user_id = localStorage.getItem('user_id');
  file: any;
  about: any;
  photo: any;
  filename: any;
  filepath = "http://localhost:8080/profileImages/";
  followingsId: number[] = [];

  canfollow: boolean = false;
  followButton = null;
  followingButton = null;
  justOpened = true;
  public blogArray:any=[];

  public users: any[]=[];
  public FourUsers: any[]=[];
  MoreUsers=true;
  clicked: boolean=false;

  noblog=false;

userInfo:any={};
  target = -1;
  userdata = { user_name: '', user_id: null, profile_photo: '', index: null };
  followersArray: any[]=[];


  constructor(private _apiService: ApiService, private _router: Router, public _authService:AuthService) {


    

  }

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

    this._apiService.getUsers().subscribe(
      res => { 
        
        this.users=res.data;
        console.log('users aree heree!!');
        
        console.log(this.users);
        
        if(this.users.length==0){
          this.MoreUsers=false;
        }
        else if(this.users.length<4){
          this.j=res.length;
          for (let index = 0; index < this.users.length; index++){
            this.FourUsers.push(this.users[index])
          }
          this.MoreUsers=false;
        }
        else{
          this.j=4;
          for (let index = 0; index < 4; index++){
            this.FourUsers.push(this.users[index])
          }
        } 

        console.log('four array');
        console.log(this.FourUsers);
        
        
        }
       , err => {
        console.log(err);
      }) 
    
    //to get the followings
    this._apiService.getFollowings(this.user_id).subscribe(
      res => {
        console.log('followings from getfollowings');

        this.followingsLength = res.data.length;
        console.log('partha b is checking');
        this.followings = res.data;
        console.log('before adding boolean');
        console.log(this.followings);
        // this.followings=res.data;

        for (let index = 0; index < res.data.length; index++) {
          // console.log(index);
          // this.followings[res.data[index].user_id]=res.data[index];
          // this.followings[res.data[index].user_id]['isFollowing']=false;
          // this.followings[]
          this.followings[index]['following'] = true;
          // this.followingsId.push(<number>res.data[index].user_id);

        }
        // for (let index = 0; index < res.data.length; index++){
        //   // console.log(index);

        //   this.followings.push(res.data[index]);
        //   this.followingsId.push(<number>res.data[index].user_id);
        // }
        // this.followers.push(Object.values(res.data));
        console.log('followings frm profile');
        console.log(this.followings);
        // console.log('followingsId frm profile');

        // console.log(this.followingsId);
        // console.log(index)  


      }, err => {
        console.log(err);
      })


    //to get the followers
    this._apiService.getFollowers(this.user_id).subscribe(
      res => {
        console.log('res from getfollowers');

        console.log(res.data);
        this.followersLength = res.data.length;
        // this.followers = res.data;
        console.log('followers check');
        
        // console.log(this.followers);
        
        for (let index = 0; index < res.data.length; index++) {
          // console.log(index);
          this.followers[res.data[index].user_id] = res.data[index];
          this.followers[res.data[index].user_id]['isFollowing'] = false;
          // this.followers.push(res.data[index])
        }
        console.log(this.followers);
        

        for (let index = 0; index < this.followings.length; index++) {
          // const element = array[index];/
          try {
            this.followers[this.followings[index].user_id].isFollowing=true;
            
          } catch (error) {
            console.log(`you are not following user ${this.followings[index].user_id}`);
            
          }
          
        }
        // this.followers.push(Object.values(res.data));
        console.log('followersArray from profile');

        // console.log(index)  
        this.followersArray=Object.values(this.followers);
        console.log(this.followersArray);
        

      }, err => {
        console.log(err);
      })

    //to get the userBlogs
    this._apiService.getUserBlogs(this.user_id).subscribe(
      res => { 
        console.log('partha b is checking getuserblogs');
        console.log(res.data);
        if(res.data=='No blog found')this.noblog=true;
        
        
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
        console.log('likedposts are');
        // console.log(this.likedPosts);
        this._apiService.getYouLikeYourPost().subscribe(
          res=>{
            console.log('response from getYouLikeYourPost');
            console.log(res);
            
            for (let index = 0; index < res.data.length; index++) {
              // const element = array[index];
              console.log('want it now');
              console.log(this.blogs);
              
              console.log();
              
              
              this.blogs[res.data[index].blog_id].likedby=true;
  
              
            }
            this.blogArray=Object.values(this.blogs)
            console.log('againg blogs array:');
            ;
            console.log(this.blogArray);
          }
        )

        //get profile users followings
        
        

       }, err => {
        console.log(err);
      })

  }
  getFollowings() {
    this._apiService.getFollowings(this.user_id).subscribe(
      res => {
        console.log('followings from getfollowings');

        this.followingsLength = res.data.length;
        console.log('partha b is checking');
        this.followings = res.data;
        console.log('before adding boolean');
        console.log(this.followings);
        // this.followings=res.data;

        for (let index = 0; index < res.data.length; index++) {
          // console.log(index);
          // this.followings[res.data[index].user_id]=res.data[index];
          // this.followings[res.data[index].user_id]['isFollowing']=false;
          // this.followings[]
          this.followings[index]['following'] = true;
          // this.followingsId.push(<number>res.data[index].user_id);

        }
        // for (let index = 0; index < res.data.length; index++){
        //   // console.log(index);

        //   this.followings.push(res.data[index]);
        //   this.followingsId.push(<number>res.data[index].user_id);
        // }
        // this.followers.push(Object.values(res.data));
        console.log('followings frm profile');
        console.log(this.followings);
        // console.log('followingsId frm profile');

        // console.log(this.followingsId);
        // console.log(index)  


      }, err => {
        console.log(err);
      })


      
  }

  getFollowers() {
    this._apiService.getFollowers(this.user_id).subscribe(
      res => {
        console.log('res from getfollowers');

        console.log(res.data);
        this.followersLength = res.data.length;
        // this.followers = res.data;
        console.log('followers check');
        
        // console.log(this.followers);
        
        for (let index = 0; index < res.data.length; index++) {
          // console.log(index);
          this.followers[res.data[index].user_id] = res.data[index];
          this.followers[res.data[index].user_id]['isFollowing'] = false;
          // this.followers.push(res.data[index])
        }
        console.log(this.followers);
        

        for (let index = 0; index < this.followings.length; index++) {
          // const element = array[index];/
          console.log('show is following');
          console.log(this.followings);
          
          console.log(this.followings[index].user_id);
          try {
            this.followers[this.followings[index].user_id].isFollowing=true;
            
          } catch (error) {
            console.log(`you are not following user ${this.followings[index].user_id}`);
            
          }
          
        }
        // this.followers.push(Object.values(res.data));
        console.log('followersArray from profile');

        // console.log(index)  
        this.followersArray=Object.values(this.followers);
        console.log(this.followersArray);
        

      }, err => {
        console.log(err);
      })



  }

  selectImg(event: any) {
    if (event.target.files.length > 0) {
      // console.log("from selectImg block")
      // console.log('before indexing');

      // const photo=event.target.files[0];
      //   const reader = new FileReader();
      // reader.readAsDataURL(photo);
      // reader.onload = () => {
      //     this.file=reader.result;
      // };
      this.photo = event.target.files[0];
      // console.log('after indexing');
      // console.log("photo is:" + this.blog.photo);
      // console.log(this.blog.photo);



      // this.file=Object.entries(photo);
      // console.log(this.blog.photo.entries)
      // console.log("type of file is:" + typeof (this.blog.photo));

    }
  }

  getUserDetails(){
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
  }

  public onSubmitPhoto() {

    const payload = new FormData();
    payload.append('username', this.userInfo.user_name);
    // payload.append('about', this.about);
    payload.append('photo', this.photo, this.photo.name ? this.photo.name : "");


    this._apiService.uploadProfileInfo(payload).subscribe(
      res => {
        alert('uploaded!')
      },
    )
    window.location.reload();


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
 followFromYouMayFollow(others_id:any){
  console.log(others_id);
  if(this._apiService.user_id!=null){
    this._apiService.follow(others_id).subscribe();
    this.target=others_id;
    console.log("target is:"+this.target);
  }
  else{
    this._router.navigate(['/login'])
  }
  
 }



 unfollowFromYouMayFollow(others_id:any){
  console.log(others_id);
  this.clicked=false;
  this.target=-1;
  this._apiService.unfollow(others_id).subscribe(
    res=>console.log(res)
  )
 }




  public follow(others_id: any, index: any) {
    console.log('follow button clicked!');
    console.log(others_id);
    this.followings[index].following = true;
    // this.followersArray[index].isFollowing = true;
    this._apiService.follow(<number>others_id).subscribe();
    this.target = -1;
    this.followingButton = others_id;
    this.followingsLength += 1;
  }


  public followback(others_id: any, index:any) {
    console.log('follow button clicked!');
    console.log(others_id);
    this._apiService.follow(others_id).subscribe();
    // this.fo
    this.followersArray[index].isFollowing=true;
    // event.target.hidden = true;
    this.followingsLength += 1;
  }


  gotoUser(username: string) {
    this._router.navigate(['', username]);
  }

  gotoUnfollowModal(a: any, b: any, c: any, index: any) {
    this.userdata.user_id = a;
    this.userdata.user_name = b;
    this.userdata.profile_photo = c;
    this.userdata.index = index;
    console.log('userdata is');
    console.log(this.userdata);
  }

  unfollow(others_id: any, index: any) {

    console.log("you are no longer following ");
    console.log(others_id);
    this.followings[index].following = false;

    this.target = others_id;

    this._apiService.unfollow(others_id).subscribe(
      res => console.log(res)
    )
    this.followingsLength -= 1;


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
