import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import dateFormat, { masks } from "dateformat";

@Component({
  selector: 'app-explore-hashtags',
  templateUrl: './explore-hashtags.component.html',
  styleUrls: ['./explore-hashtags.component.css']
})
export class ExploreHashtagsComponent implements OnInit {
  public StrBlog = '';
  public blogs: any = {};
  public searchInput: string = '';
  public searchResult: [] = [];
  public allBlogTitles: string[] = [];
  public allUsernames: any[] = [];
  public users: any[] = [];
  public FourUsers: any = [];
  // public x: [string, number];
  public blogArray: any = [];
  public followings: number[] = [];
  comments: any[] = [];
  target = -1;
  atBegin = false;

  // public i:number=4;
  public j: number = 0;
  MoreUsers = true;
  clicked: boolean = false;
  openCommentSection: string = '';
  text: string = '';
  targetId: any;
  hashtag: any;
  public blogsByHashtag: any = {};
  private sub: any;
  public popularHashtags: any = [];

  constructor(private _route: ActivatedRoute, private _apiService: ApiService, private _router: Router) { }

  ngOnInit(): void {
    // window.location.reload();
    //function related to follow button

    this.sub = this._route.paramMap.subscribe(
      (param: ParamMap) => {
        this.hashtag = param.get('hashtag');
        this.FourUsers = [];
//je logged inn ache tar followings
        this._apiService.getFollowingsId().subscribe(
          res => {
            if (res.data != 0) {
              console.log('from home ngOnInit showing the followings');
              console.log(res.data);


              for (let index = 0; index < res.data.length; index++) {
                this.followings[index] = <number>res.data[index].user_id;
              }
              console.log("###############from home followings is:");
              console.log(this.followings);


            }

            //getting blogs that used the searched hashtag
            this._apiService.getBlogsByHashtages(this.hashtag).subscribe(
              res => {

                for (let index = 0; index < res.data.length; index++) {


                  this.blogsByHashtag[res.data[index].blog_id] = res.data[index];
                  this.blogsByHashtag[res.data[index].blog_id]['likedby'] = false;
                  this.blogsByHashtag[res.data[index].blog_id]['canComment'] = false;
                  let string=res.data[index].hashtags;
                  if (string.charAt(0)=='#') {
                    string=string.substr(1,string.length);
                  }
                  this.blogsByHashtag[res.data[index].blog_id]['hashtags']=string.split("#");
                }
                
                //printing blogs by hashtags
                console.log('blogs by hashtags');
                console.log(this.blogsByHashtag);



                this._apiService.getLikedPosts().subscribe(
                  res => {
                    console.log('response from get likedposts');
                    console.log(res.data);
                    console.log("keys of blogsbyhashtag");
                    console.log(Object.keys(this.blogsByHashtag));
                    
                    


                    for (let index = 0; index < res.data.length; index++) {
                      console.log("keys are");
                      console.log(Object.keys(this.blogsByHashtag));
                      console.log("input");
                      console.log(res.data[index].blog_id);
                      
                      
                      
                      let input=''+res.data[index].blog_id;
                      if (Object.keys(this.blogsByHashtag).includes(input))
                        this.blogsByHashtag[res.data[index].blog_id].likedby = true;
                    }

                    this.blogArray = Object.values(this.blogsByHashtag)
                    console.log('final blogs array:');
                    console.log(this.blogArray);

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


                  }
                )

              }, err => {
                console.log(err);
              })
          }

        )





      }
    )







  }

  
  follow(others_id: any) {
    console.log(others_id);
    if (this._apiService.user_id != null) {
      this._apiService.follow(others_id).subscribe();
      this.target = others_id;
      console.log("target is:" + this.target);
    }
    else {
      this._router.navigate(['/login'])
    }

  }



  unfollow(others_id: any) {
    console.log(others_id);
    this.clicked = false;
    this.target = -1;
    this._apiService.unfollow(others_id).subscribe(
      res => console.log(res)
    )
  }



  isNotFollowing(othersId: any) {
    // if(localStorage.getItem('user_id')==null)return false;

    this._apiService.isFollowing(othersId).subscribe(
      res => {
        if (res.result === 'true') return false;
        return true;
      }
    )


  }

  gotoUser(username: string) {
    this._router.navigate(['', username]);
  }

  gotoHashtag(username: string) {
    // this._router.navigate([]);
    this._router.navigate(['search/', username])
    // this._router.navigate(['search/',username]).then(() => {
    // window.location.reload();
    // });
  }

  comment(index: number, blog_id: number) {
    // this.targetSection=(-1*blog_id);
    // this.targetId=blog_id;
    // this.toggle=!this.toggle;
    // console.log(this.toggle);
    this.blogArray[index].canComment = !this.blogArray[index].canComment;

    this._apiService.getComments(blog_id).subscribe(
      res => {
        this.comments = res.data;
      }
    )
  }

  addComment(blog_id: any, user_id: any, comment: any) {
    console.log("commnet is");
    console.log(comment);
    console.log(blog_id);
    console.log(user_id);
    // let dateFormat = require('dateformat');

    let now = new Date();
    let jstoday = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM TT");
    console.log(jstoday);


    this._apiService.addComment(blog_id, user_id, comment, jstoday).subscribe(
      res => {
        console.log(res)
        this._apiService.getComments(blog_id).subscribe(
          res => {
            let length = res.data.length;
            for (let index = 0; index < length; index++) {
              this.comments[index] = res.data[length - 1 - index]
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
  like(blog_id: any, index: any) {
    this._apiService.like(blog_id).subscribe(res => console.log(res),
      err => {
        console.log('err is' + err);

        if (err instanceof HttpErrorResponse)
          if (err.status === 401) {
            console.log('error found!');

            this._router.navigate(['/login'])
          }
      }

    )
    this.blogArray[index].likedby = true;
    this.blogArray[index].likes += 1;
  }
  unlike(blog_id: any, index: any) {
    this._apiService.unlike(blog_id).subscribe(res => console.log(res))
    this.blogArray[index].likedby = false;
    this.blogArray[index].likes -= 1;
  }




}
