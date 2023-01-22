import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  viewPassIcon=false;
  viewPassword=false;
  registerUserData={username:"",email:"",password:""};
  constructor(private _auth:AuthService,private _router:Router) { }
  submitted=false;
  ngOnInit(): void {
  }

  registerUser(){

    this.submitted=true;
    this._auth.registerUser(this.registerUserData)
    // console.log(this.registerUserData);
    .subscribe(
      res=>{
        console.log(res),
        localStorage.setItem('token',res.token),
        localStorage.setItem('user_id',res.user_id),

        this._router.navigate(['/home'])
      },
      err=>console.log(err)
    )
  }
  showPass(){
    this.viewPassIcon=!this.viewPassIcon;
    this.viewPassword=!this.viewPassword;
  }

}
