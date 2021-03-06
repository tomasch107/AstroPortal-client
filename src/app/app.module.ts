import { IconsModule } from './icons/icons.module';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BoardAdminComponent } from './components/board-admin/board-admin.component';
import { BoardModeratorComponent } from './components/board-moderator/board-moderator.component';
import { BoardUserComponent } from './components/board-user/board-user.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { SignUpSignInComponent } from './components/sign-up-sign-in/sign-up-sign-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { ErrorWindowComponent } from './components/error-window/error-window.component';
import { UploadFilesComponent } from './components/components/upload-files/upload-files.component';
import { UploadProfilePictureComponent } from './components/upload-profile-picture/upload-profile-picture.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { PleaseLoginComponent } from './components/please-login/please-login.component';
import { ImageComponent } from './components/images/image/image.component';
import { UserImageComponent } from './components/images/user-image/user-image.component';
import { ImageCommentComponent } from './components/image-comment/image-comment.component';
import { MomentModule } from 'ngx-moment';
import { MomentPipe } from './helpers/moment.pipe';
import { SearchWindowComponent } from './components/search/search-window/search-window.component';
import { SearchFromComponent } from './components/search/search-from/search-from.component';
import { ConversationComponent } from './components/messages/conversation/conversation.component';
import { ConversationListComponent } from './components/messages/conversation-list/conversation-list.component';
import { MessagesComponent } from './components/messages/messages/messages.component';
import { FollowingComponent } from './components/following/following.component';
import { ImageDescriptionComponent } from './components/images/image-description/image-description.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EditImageComponent } from './components/images/edit-image/edit-image.component';
import { ChangeConversationNameComponent } from './components/messages/change-conversation-name/change-conversation-name.component';
import { ConversationParticipantsComponent } from './components/messages/conversation-participants/conversation-participants.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    ManageUsersComponent,
    SignUpSignInComponent,
    ErrorWindowComponent,
    UploadFilesComponent,
    UploadProfilePictureComponent,
    UploadImageComponent,
    PleaseLoginComponent,
    ImageComponent,
    UserImageComponent,
    ImageCommentComponent,
    MomentPipe,
    SearchWindowComponent,
    SearchFromComponent,
    ConversationComponent,
    ConversationListComponent,
    MessagesComponent,
    FollowingComponent,
    ImageDescriptionComponent,
    EditImageComponent,
    ChangeConversationNameComponent,
    ConversationParticipantsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    IconsModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    MaterialModule,
    NgxDropzoneModule,
    MomentModule,
    InfiniteScrollModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
