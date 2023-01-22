import { Injectable} from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService{

  constructor(private _auth: AuthService) { }

  // intercept(req: any, next: { handle: (arg0: any) => any; }){
  //   let authService =this._injector.get(AuthService)
  //     let tokenizedReq=req.clone({
  //       setHeader:{
  //         Authorization: `Bearer ${authService.getToken()}`
  //       }
  //     })
  //     return next.handle(tokenizedReq);
  // }


  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // if (!request.headers.has('Content-Type')) {
    //   request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    // }
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this._auth.getToken()}`
      }
    });
    return next.handle(request);
  }
}
