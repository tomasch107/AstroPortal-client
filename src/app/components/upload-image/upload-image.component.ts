import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../../_services/error-service.service';
import { UserService } from '../../../_services/user.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { DateValidator } from '../../helpers/date-validator';
import { ImagesService } from '../../../_services/images.service';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../_services/theme.service';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {
  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';
  currentUser: any;
  files: File[] = [];
  fileSelected = false;
  maximumDescChar = 2000;
  loading = false;
  theme='';
  nickname;
  constructor(
    private token: TokenStorageService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public dialog: MatDialog,
    private imageService: ImagesService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.createForm();
    this.userService.getUserData().subscribe(
      (data) => {
          this.nickname = data.nickname;
      },
      (err) => {
        this.messageService.showError(err);
      },
      () => this.loading = false
    );
    this.theme = this.themeService.getTheme()
    this.themeService.themeChanged$.subscribe(data=>this.theme=data)
  }

  onSelect(event) {
    this.files.splice(0);
    this.files.push(...event.addedFiles);
    this.fileSelected = true;
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.fileSelected = false;
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

  onSubmit(post) {
    this.loading = true;
    this.imageService.uploadImage(post, this.files[0]).subscribe(
      (data) => {
          if(data instanceof HttpResponse)
              this.router.navigateByUrl('/users/' + this.nickname + '/' + data.body.id);
        },
      (err) => {
        this.messageService.showError(err);
      },
      () => this.loading = false
    );
  }

  getDropzoneStyle(){
    if (this.theme ==='Dark'){
      return {
        "background" : "gray",
        "border": "2px dashed #FFFFFF"
      }
  }
}
}
