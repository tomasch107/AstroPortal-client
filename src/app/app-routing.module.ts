import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardAdminComponent } from './components/board-admin/board-admin.component';
import { BoardModeratorComponent } from './components/board-moderator/board-moderator.component';
import { BoardUserComponent } from './components/board-user/board-user.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { SignUpSignInComponent } from './components/sign-up-sign-in/sign-up-sign-in.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { ImageComponent } from './components/images/image/image.component';
import { UserImageComponent } from './components/images/user-image/user-image.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'mod', component: BoardModeratorComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin/manageUsers', component: ManageUsersComponent },
  { path: 'getstarted', component: SignUpSignInComponent},
  { path: 'uploadimage', component: UploadImageComponent},
  { path: 'users/:username/:imageId', component: ImageComponent},
  { path: 'users/:username', component: UserImageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
