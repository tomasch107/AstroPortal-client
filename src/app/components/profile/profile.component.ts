import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/_services/token-storage.service';
import { UserService } from '../../../_services/user.service';
import { UserProfile } from '../../model/user-profile';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from '../../../_services/error-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';

  currentUser: any;
  userProfileData: UserProfile;
  constructor(
    private token: TokenStorageService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.createForm();

    this.userService.getUserData().subscribe(
      data => {
        this.userProfileData = data;
        this.formGroup.controls['nickname'].setValue(this.userProfileData.nickname);
        this.formGroup.controls['name'].setValue(this.userProfileData.name);
        this.formGroup.controls['country'].setValue(this.userProfileData.country);
        this.formGroup.controls['lastName'].setValue(this.userProfileData.lastName);
         },
      err => {
        this.userProfileData = JSON.parse(err.error).message;
      }
    );

  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      'name': [null],
      'nickname': [null, Validators.required],
      'country': [null],
      'lastName': [null],
    });
  }

  onSubmit(post) {
    this.userService.saveUserData(post).subscribe( data =>{

    },
    err =>{
      console.log(err)
      this.messageService.showErrorWindow(err.error);
    });
  }
}
