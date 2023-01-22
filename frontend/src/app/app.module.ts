import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { fromEventPattern } from 'rxjs';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { WriteBlogComponent } from './write-blog/write-blog.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { ProfileComponent } from './profile/profile.component';
import { SearchPipe } from './pipes/search.pipe';
import { FindUserPipe } from './find-user.pipe';
import { VarUserComponent } from './var-user/var-user.component';
import { UserNotTherePipe } from './pipes/user-not-there.pipe';
import { SearchHashtagPipe } from './pipes/search-hashtag.pipe';
import { ExploreHashtagsComponent } from './explore-hashtags/explore-hashtags.component';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    WriteBlogComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    SearchPipe,
    FindUserPipe,
    VarUserComponent,
    UserNotTherePipe,
    SearchHashtagPipe,
    ExploreHashtagsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule  
  ],
  providers: [AuthService,ApiService,AuthGuard,{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptorService,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
