import { Component, OnInit, Renderer2  } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ParseSourceFile } from '@angular/compiler';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  close=true;
  viewPassIcon=false;
  viewPassword=false;
  counter!: number;
  tryagain=false;
  submitted=false;
  loginUserData={email:"",password:""};
  constructor(private _auth:AuthService,private _router:Router,private renderer: Renderer2) { }
  ngOnInit(): void {
    this.counter=0;
    // this.renderer.setStyle(
    //   document.body,
    //   'background',
    //   'radial-gradient(white 35%, rgb(0, 247, 255))'
    // );
  }
  // ngOnDestroy(): void {
  //   this.renderer.removeStyle(document.body, 'background');
  // }

  loginUser(){
    
    this._auth.loginUser(this.loginUserData)
    .subscribe(
      (res)=>{console.log(res);
        if(res.status===0){
          //show user two options 1.try again 2.register
          //if try again then reload page 
          //else navigate to register page
          // window.location.reload();

          //make register button visible and try again button visible
          this.tryagain=true;
          this.counter=1;
          // this.submitted=true;
        }
        else{
          this.submitted=true
          localStorage.setItem('token',res.token),
          localStorage.setItem('user_id',res.data[0].user_id),
          this._router.navigate(['/home'])
  .then(() => {
    window.location.reload();
  });
          // window.location.reload();
      }
    },
        
      (err)=>{
        console.log(err)
      })
  }


  login(){
    window.location.reload();
  }
  register(){
    this._router.navigate(['/register'])
  }

  showPass(){
    this.viewPassIcon=!this.viewPassIcon;
    this.viewPassword=!this.viewPassword;
  } 

  closeit(){
    this.tryagain=!this.tryagain
  }

}
