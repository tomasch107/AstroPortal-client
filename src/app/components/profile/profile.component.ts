import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/_services/token-storage.service';
import { UserService } from '../../../_services/user.service';
import { UserProfile } from '../../model/user-profile';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from '../../../_services/error-service.service';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UploadProfilePictureComponent } from '../upload-profile-picture/upload-profile-picture.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';
  profilePictureUrl: Observable<string>;
  currentUser: any;
  userProfileData: UserProfile;

  constructor(
    private token: TokenStorageService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.createForm();
    this.profilePictureUrl = of('../../../assets/images/defaultProfile.png').pipe();
    this.getUserData();
  }

  getUserData() {
    this.userService.getUserData().subscribe(
      data => {
        this.userProfileData = data;
        this.formGroup.controls['nickname'].setValue(this.userProfileData.nickname);
        this.formGroup.controls['name'].setValue(this.userProfileData.name);
        this.formGroup.controls['country'].setValue(this.userProfileData.country);
        this.formGroup.controls['lastName'].setValue(this.userProfileData.lastName);
        this.formGroup.controls['profileDescription'].setValue(this.userProfileData.profileDescription);
        var profilePictureUrl: string = this.userProfileData.profilePictureUrl;
        if(profilePictureUrl != null && profilePictureUrl.length > 0)
          this.profilePictureUrl = of(profilePictureUrl).pipe();

         },
      err => {
        if(err.error instanceof String)
          this.messageService.showErrorWindow(err.error);
        else
          this.messageService.showErrorWindow(err.error.error);
      }
    );
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      'name': [null],
      'nickname': [null, Validators.required],
      'country': [null],
      'lastName': [null],
      'profileDescription': [null, Validators.maxLength(2000)]
    });
  }

  onSubmit(post) {
    post.id = this.userProfileData.id;
    this.userService.saveUserData(post).subscribe( data =>{

    },
    err =>{
      this.messageService.showErrorWindow(err.error.message);
    });
  }

  editProfilePicture(){
    const dialogRef = this.dialog.open(UploadProfilePictureComponent, {
      panelClass: 'uploadProfilePicture',
      data: {
        profileId: this.userProfileData.id
      },
    });

    dialogRef.afterClosed().subscribe( data => {
      this.getUserData();
    });
  }
}
