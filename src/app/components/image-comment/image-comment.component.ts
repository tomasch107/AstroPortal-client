import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ImagesService } from '../../../_services/images.service';
import { MessageService } from '../../../_services/error-service.service';
import { PageEvent } from '@angular/material/paginator';
import { ImageComment } from 'src/app/model/image-comment';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-image-comment',
  templateUrl: './image-comment.component.html',
  styleUrls: ['./image-comment.component.scss']
})
export class ImageCommentComponent implements OnInit {
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  comments: Observable<Array<ImageComment>>
  pageEvent: PageEvent;

  @Input() imageId: number;
  @Input() private commentAdded: EventEmitter<boolean>;

  constructor(private imagesService: ImagesService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    if (this.commentAdded) {
      this.commentAdded.subscribe(data => {
          console.log(data);
          let newPageEvent: PageEvent = new PageEvent();
          if (!this.pageEvent)
          {
            newPageEvent.pageIndex = 0;
            newPageEvent.pageSize = 10;
          }
          else
            newPageEvent = this.pageEvent;
          this.onPageEvent(newPageEvent);
      });
    }
    this.getComments(0, 10);
  }

  getComments(page: number, size: number){
    this.imagesService.getCommentsForImage(this.imageId, page+1, size).subscribe(
      (data) => {
        this.comments = of(data.comments);
        this.length = data.totalItems
        console.log(data);
      },
      (err) => {
        this.messageService.showError(err);
      },
    );
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  onPageEvent(pageEvent: PageEvent)
  {
    this.pageEvent = pageEvent;
    this.getComments(pageEvent.pageIndex, pageEvent.pageSize);
  }

  onProfilePictureClick(nickname:string)
  {

  }
}
