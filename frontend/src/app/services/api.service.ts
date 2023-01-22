import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Blog } from '../blog';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private _apiUrl="http://localhost:8080/api";
  user_id: any;

  constructor(private _http:HttpClient, private router:Router) {
    this.user_id=localStorage.getItem('user_id');
   }

  upload(data: FormData):Observable<any> {
    // console.log(data);
    // let formParams = new FormData();
    // formParams.append('photo', data)
  return this._http.post(this._apiUrl+"/uploadBlog",data)
}

uploadProfileInfo(data: FormData):Observable<any> {
    // console.log(data);
    // let formParams = new FormData();
    // formParams.append('photo', data)
  return this._http.post(this._apiUrl+"/uploadProfileInfo",data)
}

get12PopularHashtags():Observable<any>{
  return this._http.get(this._apiUrl+"/get12PopularHashtags")
}
get12MostFollowedUsers():Observable<any>{
  return this._http.post(this._apiUrl+"/get12MostFollowedUsers",{"user":this.user_id})
}


addComment(a:any,b:any,c:any,d:any):Observable<any>{
  return this._http.post(this._apiUrl+"/comment", {"blog_id":a,"user_id":b,"comment":c,"time":d})
}
getComments(blog_id:any):Observable<any>{
  return this._http.post(this._apiUrl+"/getComments", {"blog_id":blog_id})
}
getFilePathByUsername(user_name:any):Observable<any>{
  return this._http.post(this._apiUrl+"/getFilePathByUsername", {user_name})
}
 
  getWriteblogPage():Observable<any>{
    return this._http.get<any>(this._apiUrl+"/getWriteblogPage");
  }

  getHashtags():Observable<any>{
    return this._http.get<any>(this._apiUrl+"/getHashtags");
  }
  gotoProfile():Observable<any>{
    return this._http.get<any>(this._apiUrl+"/gotoProfile");
  }
  getblogs():Observable<any>{
    return this._http.post(this._apiUrl+"/getblogs",{user_id:this.user_id});
  }
  getUserBlogs(user_id:any):Observable<any>{
    return this._http.post(this._apiUrl+"/getUserBlogs", {user_id})
  }
  getBlogsByHashtages(hashtag:any):Observable<any>{
    return this._http.post(this._apiUrl+"/getBlogsByHashtages", {hashtag})
  }
  getUserBlogsByUserName(user_name:any):Observable<any>{
    console.log('user_name is from fe-');
    console.log(user_name);
    
    
    return this._http.post(this._apiUrl+"/getUserBlogsByUserName", {user_name})
  }

  getUsers():Observable<any>{  
    return this._http.post(this._apiUrl+"/getUsers", {user:this.user_id})
  }

  getAllUsers():Observable<any>{  
    return this._http.get(this._apiUrl+"/getAllUsers")

  }

  getFollowers(user_id:any):Observable<any>{
    console.log('userid for followers');
    
    console.log(user_id);
    
      return this._http.post(this._apiUrl+"/getFollowers", {user_id:user_id})
  }

  getFollowings(user_id:any):Observable<any>{
    console.log('userid for followings');

    console.log(user_id);
    
      return this._http.post(this._apiUrl+"/getFollowings", {user_id:user_id})
  }
  getFollowingsId():Observable<any>{
      return this._http.post(this._apiUrl+"/getFollowingsId", {user_id:this.user_id})
  }

  follow(others_id:any):Observable<any>{
      console.log('trying to  follow from fe');
      return this._http.post(this._apiUrl+"/follow", {user_id:this.user_id,others_id:others_id})
  }
  unfollow(others_id:any):Observable<any>{
      console.log('trying to unfollow from fe');
      return this._http.post(this._apiUrl+"/unfollow", {user_id:this.user_id,others_id:others_id})
  }
  isFollowing(others_id:any):Observable<any>{
      console.log('trying to  know if already following or not from fe');
      return this._http.post(this._apiUrl+"/isFollowing", {me:this.user_id,you:others_id})
  }

  getUserInfo(data:any):Observable<any>{
    console.log(data);
    return this._http.post(this._apiUrl+"/getUserInfo", {data:data})
  }
  getUserInfoByUsername(data:any):Observable<any>{
    console.log(data);
    return this._http.post(this._apiUrl+"/getUserInfoByUsername", {data:data})
  }

  getYouLikeYourPost():Observable<any>{
    return this._http.post(this._apiUrl+"/youLikeYourPost", {user_id:this.user_id})
  }
  getVarPostYouLiked(varUser:any):Observable<any>{
    return this._http.post(this._apiUrl+"/varPostYouLiked", {user_id:this.user_id,vars_id:varUser})
  }
  getLikedPosts():Observable<any>{
    return this._http.post(this._apiUrl+"/getLikedPosts", {user_id:this.user_id})
  }
  like(blog_id:any):Observable<any>{
    return this._http.post(this._apiUrl+"/like", {user_id:this.user_id,blog_id:blog_id})
  }
  unlike(blog_id:any):Observable<any>{
    return this._http.post(this._apiUrl+"/unlike", {user_id:this.user_id,blog_id:blog_id})
  }

  

  

 
}
