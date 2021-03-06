import { Component, EventEmitter, Input, OnInit } from '@angular/core';
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
import { ThemeService } from '../../../../_services/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { EditImageComponent } from '../edit-image/edit-image.component';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {

  @Input() inputImage: ImageData;
  imageId: number;
  username;
  formGroup: FormGroup;
  imageUri: Observable<string>;
  imageData: ImageData;
  loading = true;
  cuttedDescription;
  profileHref: string;
  loggedIn = false;
  numberOfLikes: number = 0;
  isImageLiked = false;
  color = 'warn'
  theme = '';
  commentAdded: EventEmitter<boolean> = new EventEmitter();
  profileId;
  constructor(
    private imageService: ImagesService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenStorageService: TokenStorageService,
    private themeService: ThemeService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loggedIn = this.tokenStorageService.getToken() != null;
    if (this.loggedIn)
      this.profileId = + this.tokenStorageService.getCurrentProfileId()

    if (this.inputImage)
    {
      this.imageData = this.inputImage;
    }
    else
    {
      this.route.params.subscribe((params) => {
        this.imageId = params['imageId'];
        this.username = params['username'];
        this.createForm();
        this.loading = false;
        this.getImageByIdAndUsername();
        this.getNumberOfLikes();
        this.getIsImageLiked();
      });
    }
    this.themeService.themeChanged$.subscribe(data => {this.theme = data;});
  }
  getIsImageLiked() {
    var profileId: number = + this.tokenStorageService.getCurrentProfileId();
    if(!this.loggedIn)
      return;
    this.imageService
    .isImageLiked(this.imageId, profileId)
    .subscribe(
      (data) => {
        this.isImageLiked = data;
      },
      (err) => {
        this.messageService.showErrorWindow(err.error.message);
      }
    );  }

  private getImageByIdAndUsername() {
    this.imageService
      .getImageByIdAndUsername(this.imageId, this.username)
      .subscribe(
        (data: ImageData) => {
          this.imageUri = of(data.imageUrl).pipe();
          this.imageData = data;
          this.profileHref = '/users/' + data.userProfileNickname;

          if (data.description != null && data.description.length > 30)
            this.cuttedDescription = data.description.substring(0, 30);
          else
            this.cuttedDescription = data.description;
        },
        (err) => {
          this.messageService.showErrorWindow(err.error.message);
        },
        () => (this.loading = false)
      );
  }

  private getImageById() {
    this.imageService
      .getImageById(this.imageId)
      .subscribe(
        (data: ImageData) => {
          this.imageUri = of(data.imageUrl).pipe();
          this.imageData = data;
          if (data.description != null && data.description.length > 30)
            this.cuttedDescription = data.description.substring(0, 30);
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
    post.imageId = this.imageId;
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

  getNumberOfLikes() {
    this.imageService.getNumberOfLikes(this.imageId).subscribe(
      (data) => {
        this.numberOfLikes = data.count
      },
      (err) => {
        this.messageService.showError(err);
      },
    );  }

    onLikeClick(){
      var profileId: number = + this.tokenStorageService.getCurrentProfileId();
      if(this.isImageLiked)
      {
        this.imageService.removeLikeFromImage(this.imageId, profileId).subscribe(
          (data) => {
            this.numberOfLikes = data
            this.isImageLiked = false;
          },
          (err) => {
            this.messageService.showError(err);
          },
        );
      }
      else
      {
        this.imageService.addLikeToImage(this.imageId, profileId).subscribe(
          (data) => {
            this.numberOfLikes = data
            this.isImageLiked = true;
          },
          (err) => {
            this.messageService.showError(err);
          },
        );
      }
    }


    onEditClick(){
      const dialogRef = this.dialog.open(EditImageComponent, {
        panelClass: 'editImageDialog',
        data: {
          image: this.imageData
        },
      });

      dialogRef.afterClosed().subscribe( data => {
          if(data.title)
          {
            this.imageData = data;
          if (data.description != null && data.description.length > 30)
            this.cuttedDescription = data.description.substring(0, 30);
          else
            this.cuttedDescription = data.description;
          }
      });
    }


    openMapLocation(){
      window.open('https://www.google.com/maps/search/?api=1&'+ this.imageData.location, "_blank");
    }
}

