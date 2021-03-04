import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImagesService } from '../../../../_services/images.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from '../../../../_services/error-service.service';
import { UserService } from 'src/_services/user.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { ThemeService } from '../../../../_services/theme.service';
import { ImageData } from 'src/app/model/image-data';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss']
})
export class EditImageComponent implements OnInit {
  @Input() imageData: ImageData;
  formGroup: FormGroup;
  profileId;
  loading=false;

  constructor(private token: TokenStorageService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public dialog: MatDialog,
    private imageService: ImagesService,
    private router: Router,
    private themeService: ThemeService,
    public dialogRef: MatDialogRef<EditImageComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogInData: {image: ImageData}) { }

  ngOnInit(): void {
    if (this.dialogInData.image)
      this.imageData = this.dialogInData.image;
    this.profileId = + this.token.getCurrentProfileId()
    this.createForm();
    this.setValuesInForm();
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      title: [null, [Validators.required, Validators.maxLength(40)]],
      description: [null, Validators.maxLength(2000)],
      telescope: [null, Validators.maxLength(255)],
      camera: [null, Validators.maxLength(255)],
      mount: [null, Validators.maxLength(255)],
      exposureTimes: [null, Validators.maxLength(255)],
      date: [null],
      filters: [null, Validators.maxLength(255)],
      location: [null, Validators.maxLength(255)],
      object: [null, Validators.maxLength(255)],
    });
  }

  setValuesInForm(){
    this.formGroup.controls['title'].setValue(this.imageData.title);
    this.formGroup.controls['description'].setValue(this.imageData.description);
    this.formGroup.controls['telescope'].setValue(this.imageData.telescope);
    this.formGroup.controls['camera'].setValue(this.imageData.camera);
    this.formGroup.controls['mount'].setValue(this.imageData.mount);
    this.formGroup.controls['exposureTimes'].setValue(this.imageData.exposureTimes);
    this.formGroup.controls['date'].setValue(this.imageData.date);
    this.formGroup.controls['filters'].setValue(this.imageData.filters);
    this.formGroup.controls['location'].setValue(this.imageData.location);
    this.formGroup.controls['object'].setValue(this.imageData.object);
  }
  onSubmit(form)
  {
    form.id = this.imageData.id;
    form.userProfileId = this.imageData.userProfileId;

    this.imageService.editImage(form).subscribe(data =>{
      this.dialogRef.close(data);
    },
    err =>{
      this.messageService.showErrorWindow(err.error.message);
    });
  }
}
