import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/_services/error-service.service';
import { ImagesService } from 'src/_services/images.service';
import { Observable, of } from 'rxjs';
import { UserProfile } from 'src/app/model/user-profile';
import { ImageData } from 'src/app/model/image-data';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { UserService } from '../../../../_services/user.service';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit {

  userProfileData: Observable<UserProfile>
  images: Observable<Array<ImageData>>
  loading = true;
  username;
  loggedIn = false;
  profileId: number = 0;
  isUserWatched = false;
  watchText = 'Watch';
  constructor(private imageService: ImagesService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.loggedIn = this.tokenStorageService.getToken() != null;
    this.route.params.subscribe((params) => {
      this.username = params['username'];
      this.getAllImages();
      this.getUserPublicData();
    });
  }
  getIsProfileWatched() {
    var profileId: number = + this.tokenStorageService.getCurrentProfileId();
    if(!this.loggedIn)
      return;
    this.userService
    .isImageLiked(this.profileId, profileId)
    .subscribe(
      (data) => {
        this.isUserWatched = data;
        this.watchText = data ? 'Watching' : 'Watch';
      },
      (err) => {
        this.messageService.showErrorWindow(err.error.message);
      }
    );
  }


  private getAllImages() {
    this.loading = true;
    this.imageService
      .getAllImagesByUsername(this.username)
      .subscribe(
        (data) => {
          this.images = of(data);
        },
        (err) => {
          this.messageService.showErrorWindow(err.error.message);
        },
        () => (this.loading = false)
      );
  }

  private getUserPublicData() {
    this.loading = true;
    this.imageService
      .getUserPublicData(this.username)
      .subscribe(
        (data) => {
          this.userProfileData = of(data);
          this.profileId = data.id;
        },
        (err) => {
          this.messageService.showErrorWindow(err.error.message);
        },
        () => {
          this.loading = false;
          this.getIsProfileWatched();
        }
      );
  }

  onImageClick(image: ImageData){
    this.router.navigateByUrl('users/' + this.username + '/' + image.id);
  }

  onWatchClick(){
    var profileId: number = + this.tokenStorageService.getCurrentProfileId();
    if(this.isUserWatched)
    {
      this.userService.removeLikeFromImage(this.profileId, profileId).subscribe(
        (data) => {
          this.isUserWatched = false;
          this.watchText = 'Watch';
        },
        (err) => {
          this.messageService.showError(err);
        },
      );
    }
    else
    {
      this.userService.addLikeToImage(this.profileId, profileId).subscribe(
        (data) => {
          this.isUserWatched = true;
          this.watchText = 'Watching';
        },
        (err) => {
          this.messageService.showError(err);
        },
      );
    }
  }
}
