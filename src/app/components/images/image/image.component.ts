import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImagesService } from '../../../../_services/images.service';
import { MessageService } from '../../../../_services/error-service.service';
import { Observable, of } from 'rxjs';
import { ImageData } from 'src/app/model/image-data';
import { UserProfile } from '../../../model/user-profile';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  id;
  username;
  imageUri: Observable<string>;
  imageData: Observable<ImageData>;
  loading = true;
  cuttedDescription;
  userProfile: UserProfile;
  constructor(
    private imageService: ImagesService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['imageId'];
      this.username = params['username'];

      this.loading = false;
      this.imageService
        .getImageByIdAndUsername(this.id, this.username)
        .subscribe(
          (data: ImageData) => {
            console.log(data)
            this.imageUri = of(data.imageUrl).pipe();
            this.imageData = of(data);
            if(data.description != null && data.description.length > 30)
                this.cuttedDescription = data.description.substring(0,30);
          },
          (err) => {
            this.messageService.showErrorWindow(err.error.message);
          },
          () => (this.loading = false)
        );
        this.imageService.getUserPublicData(this.username).subscribe(
          (data: UserProfile) => {
            console.log(data)
            this.userProfile = data;
          },
          (err) => {
            this.messageService.showErrorWindow(err.error.message);
          },
          () => (this.loading = false)
        );

    });
  }
}
