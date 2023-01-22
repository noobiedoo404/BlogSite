import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { WriteBlogComponent } from './write-blog/write-blog.component';
import { AuthGuard } from './auth.guard';
import { VarUserComponent } from './var-user/var-user.component';
import { ExploreHashtagsComponent } from './explore-hashtags/explore-hashtags.component';


const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'home', component: HomeComponent },
  { path: 'search/:hashtag', component: ExploreHashtagsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'writeblog', component: WriteBlogComponent, canActivate:[AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path:'profile',component:ProfileComponent }, 
  { path:':username',component:VarUserComponent }, 
  { path: '',   redirectTo: '/home', pathMatch: 'full' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
