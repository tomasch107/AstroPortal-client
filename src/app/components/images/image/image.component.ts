import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImagesService } from '../../../../_services/images.service';
import { MessageService } from '../../../../_services/error-service.service';
import { Observable, of } from 'rxjs';
import { ImageData } from 'src/app/model/image-data';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  id;
  username;
  imageUri: Observable<string>;
  imageData: ImageData;
  loading = true;
  constructor(
    private imageService: ImagesService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['imageId'];
      this.username = params['username'];

      console.log(this.loading);
      this.imageService
        .getImageByIdAndUsername(this.id, this.username)
        .subscribe(
          (data: ImageData) => {
            console.log(data)
            this.imageUri = of(data.imageUrl).pipe();
            this.imageData = data;
          },
          (err) => {
            this.messageService.showErrorWindow(err.error.message);
          },
          () => (console.log(this.loading = false))
        );
    });
  }
}
