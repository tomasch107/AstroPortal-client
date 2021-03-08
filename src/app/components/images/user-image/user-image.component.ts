import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/_services/error-service.service';
import { ImagesService } from 'src/_services/images.service';
import { Observable, of } from 'rxjs';
import { UserProfile } from 'src/app/model/user-profile';
import { ImageData } from 'src/app/model/image-data';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { UserService } from '../../../../_services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserWatchedWatchingListComponent } from '../../profile/user-watched-watching-list/user-watched-watching-list.component';

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
  watchedCount;
  watchingCount;
  constructor(private imageService: ImagesService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private userService: UserService,
    private dialog: MatDialog) { }

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
          this.getWatchedWatchingCount();
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

  getWatchedWatchingCount(){
    this.userService.getWatchedWatchingCount(this.profileId).subscribe(
      (data) => {
          this.watchedCount = data.watchedCount;
          this.watchingCount = data.watchingCount;
      },
      (err) => {
        this.messageService.showError(err);
      },
    );
  }

  onWatchClick(){
    var profileId: number = + this.tokenStorageService.getCurrentProfileId();
    if(this.isUserWatched)
    {
      this.userService.removeLikeFromImage(this.profileId, profileId).subscribe(
        (data) => {
          this.isUserWatched = false;
          this.watchText = 'Watch';
          this.getWatchedWatchingCount();
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
          this.getWatchedWatchingCount();
        },
        (err) => {
          this.messageService.showError(err);
        },
      );
    }
  }

  showWatched()
  {
    this.showWatch(true);
  }
  showWatching()
  {
    this.showWatch(false);
  }

  showWatch(watched: boolean){
    const dialogRef = this.dialog.open(UserWatchedWatchingListComponent, {
      panelClass: 'dialog-scroll',
      height: '600px',
      width: '400px',
      data: {
        watched: watched,
        profileId: this.profileId
      },
    });
  }
}
