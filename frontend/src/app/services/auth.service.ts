import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _apiUrl="http://localhost:8080/api";
  // private _registerUrl="http://localhost:8080/api/register"
  // private _loginUrl="http://localhost:8080/api/login"

  constructor(private http:HttpClient , private _router:Router) { }

  registerUser(user: any){
    return this.http.post<any>(this._apiUrl+"/resigter",user)
  }

  loginUser(user: any){
    return this.http.post<any>(this._apiUrl+"/login",user)
  }

  loggedIn(){
    return !!localStorage.getItem('token')
  }

  getToken() {
    return localStorage.getItem('token');
}


logOut1(){
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  this._router.navigate(['/home'])
  .then(() => {
    window.location.reload();
  });
  // window.location.reload();

}
logOut2(){
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  this._router.navigate(['/login'])
  .then(() => {
    window.location.reload();
  });

}
}
