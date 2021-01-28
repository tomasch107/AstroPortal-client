import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/_services/error-service.service';
import { ImagesService } from 'src/_services/images.service';
import { Observable, of } from 'rxjs';
import { UserProfile } from 'src/app/model/user-profile';
import { ImageData } from 'src/app/model/image-data';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit {

  userProfileData: Observable<UserProfile>
  images: Observable<Array<ImageData>>
  loading;
  username;
  constructor(private imageService: ImagesService,
    private route: ActivatedRoute,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = params['username'];
      this.getAllImages();
      this.getUserPublicData();
    });
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
        },
        (err) => {
          this.messageService.showErrorWindow(err.error.message);
        },
        () => (this.loading = false)
      );
  }
}
