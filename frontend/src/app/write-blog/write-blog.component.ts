import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { Blog } from '../blog';
import dateFormat, { masks } from "dateformat";

@Component({
  selector: 'app-write-blog',
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.css']
})
export class WriteBlogComponent implements OnInit {
  
  file: any;
  hashtags: string = "";
  title: string = "";
  // description: string = "";
  body: string = "";
  user_id: any = localStorage.getItem('user_id');
  photo:any;
  userInfo:any={};
 
  // payload:any;
  // file: File = null;
  // selectImg(data:any):<any>{};
  blog:Blog;

  constructor(private _api: ApiService, private _router: Router, private httpclient: HttpClient) {
    // this.blog=new Blog("","","",this.file);
    this.blog = new Blog(this.user_id, "", "", "", "", "");
  }

  ngOnInit(): void {
    this._api.getUserInfo(this.user_id).subscribe(
      res=>{ this.userInfo=res.data[0];
      }
      )
    // this.blog = new Blog("","","","","","");
    // this._api.getWriteblogPage()
    //   .subscribe(
    //     res => {
    //       console.log(res)
    //     },
    //     err => {
    //       if (err instanceof HttpErrorResponse)
    //         if (err.status === 401) {
    //           console.log('error found!');
              
    //           this._router.navigate(['/login'])
    //         }
    //     }
    //   )

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

  //   upload(event: { target: HTMLInputElement; }) {
  //     const file = (event.target as HTMLInputElement).files[0];
  //     this.form.patchValue({
  //       img: file
  //     });
  //     this.form.get('img').updateValueAndValidity()
  //  }

  // }
  // selectSingleFile2(event){
  //   if(event.target.files.length>0){
  //     this.multiplefiles[1]=event.targer.files[0];
  //   }

  // }

  public onSubmit() {
    let now = new Date();
    let jstoday = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM TT");
    console.log(jstoday);
    
    const payload = new FormData();
    payload.append('time', jstoday);
    payload.append('user_id', this.user_id);
    payload.append('hashtags', this.hashtags.toLowerCase());
    payload.append('title', this.title);
    // payload.append('description', this.description);
    payload.append('body', this.body);
    payload.append('photo', this.photo, this.photo.name ? this.photo.name : "");
    

    this._api.upload(payload).subscribe(
      res => {
        alert('uploaded!')
      },
    )}

    // this.httpclient.post(<any>'http://localhost:8080/api/save', payload).subscribe(
    //     res => {  console.log(res); },
    //     err=>{
    //       console.log('upload failed from frontend');

    //       console.log(err)}

    // )

    onFilechange(event: any) {
      console.log(event.target.files[0])
      this.file = event.target.files[0]
    }
    
    // upload() {
    //   if (this.file) {
    //     this._api.upload(this.file).subscribe(resp => {
    //       alert("Uploaded")
    //     })
    //   } else {
    //     alert("Please select a file first")
    //   }
    // }
   }









//....................
  // form= new FormGroup({
  //   category: new FormControl('', [Validators.required]),
  //   title: new FormControl('', [Validators.required]),
  //   description: new FormControl('', [Validators.required]),
  //   body: new FormControl('', [Validators.required]),
  //   picture: new FormControl('', [Validators.required])

  // })
//   form= new FormGroup({
//     category: new FormControl('', [Validators.required]),
//     title: new FormControl('', [Validators.required]),
//     description: new FormControl('', [Validators.required]),
//     body: new FormControl('', [Validators.required]),
//     photo: new FormControl(Blob, [Validators.required])

//   })
//   constructor(private http: HttpClient) { }

//   ngOnInit(): void {
//     // this.form= new FormGroup({
//     //   category: new FormControl('', [Validators.required]),
//     //   title: new FormControl('', [Validators.required]),
//     //   description: new FormControl('', [Validators.required]),
//     //   body: new FormControl('', [Validators.required]),
//     //   picture: new FormControl('', [Validators.required])
  
//     // })
    
//   }

//   makeRequest(url: string, form: any, settings: any = { toast: true, hideLoader: false }):Observable<any> {

//     // let formData = form;
//     const uploadData = new FormData(); // Create Form Data object to upload the file in POST FORM
//     const user=localStorage.getItem('user_id');
//     uploadData.set("user_id",this.user_id)
//     for (let i in form) {
//       if (form[i] instanceof Blob){  //  Check if key value is file
//         uploadData.set(i, form[i], form[i].name ? form[i].name : "");
//       }
//       else
//         uploadData.append(i, form[i]);
//     }
    
//     return this.http.post(url, uploadData)
//       .pipe(map((data: any) => {
//         //handle api 200 response code here or you wanted to manipulate to response
//         return data;
//       })
//         ,
//         catchError((error) => {    // handle error
        
//           if (error.status == 404) {
//             //Handle Response code here
//           }
//           console.log('error in make request');
          
//           return throwError(error);
//         })
//       );

//   }

 

//   submit() {
//     console.log('submitted!')
//     this.makeRequest("http://localhost:8080/save", this.form.value).subscribe(
//       res => {  console.log(res); },
//         err=>{
//           console.log('upload failed from frontend');

//           console.log(err)}
      
      
//       //handle response
//     )
//   }

//   getFile(event:any) {

//     let extensionAllowed = {"png":true,"jpeg":true};
//     console.log(event.target.files);
//     // if (event.target.files[0].size / 1024 / 1024 > 20) {
//     //   alert("File size should be less than 20MB")
//     //   return;
//     // }
//     // if (extensionAllowed) {
//     //   var nam = event.target.files[0].name.split('.').pop();
//     //   if (!extensionAllowed[nam]) {
//     //     alert("Please upload " + Object.keys(extensionAllowed) + " file.")
//     //     return;
//     //   }
//     // }
//     this.form.controls["photo"].setValue(event.target.files[0]);

//   }
// }


