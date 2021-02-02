import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagesService } from '../../../../_services/images.service';
import { MessageService } from '../../../../_services/error-service.service';
import { Observable, of } from 'rxjs';
import { ImageData } from 'src/app/model/image-data';
import { UserProfile } from '../../../model/user-profile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ImageComment } from '../../../model/image-comment';
import { TokenStorageService } from '../../../../_services/token-storage.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  id;
  username;
  formGroup: FormGroup;
  imageUri: Observable<string>;
  imageData: Observable<ImageData>;
  loading = true;
  cuttedDescription;
  userProfile: Observable<UserProfile>;
  profileHref: string;
  commentAdded: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private imageService: ImagesService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['imageId'];
      this.username = params['username'];
      this.createForm();
      this.loading = false;
      this.getImageByIdAndUsername();
      this.getUserPublicData();
    });
  }
  private getImageByIdAndUsername() {
    this.imageService
      .getImageByIdAndUsername(this.id, this.username)
      .subscribe(
        (data: ImageData) => {
          this.imageUri = of(data.imageUrl).pipe();
          this.imageData = of(data);
          if (data.description != null && data.description.length > 30)
            this.cuttedDescription = data.description.substring(0, 30);
        },
        (err) => {
          this.messageService.showErrorWindow(err.error.message);
        },
        () => (this.loading = false)
      );
  }

  private getUserPublicData() {
    this.imageService.getUserPublicData(this.username).subscribe(
      (data: UserProfile) => {
        this.userProfile = of(data);
        this.profileHref = 'users/' + data.nickname;
      },
      (err) => {
        this.messageService.showErrorWindow(err.error.message);
      },
      () => (this.loading = false)
    );
  }

  onProfilePictureClick(){
    this.router.navigateByUrl(this.profileHref);
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      commentText: [null, Validators.maxLength(1000)],
    });
  }

  onSubmit(post: ImageComment) {
    post.imageId = this.id;
    post.userProfileId = + this.tokenStorageService.getCurrentProfileId();
    this.imageService.addComment(post).subscribe(
      (data: ImageComment) => {
        this.commentAdded.emit();
      },
      (err) => {
        this.messageService.showError(err);
      },
      () => (this.formGroup.reset())
    );
  }
}
