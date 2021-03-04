import { getTestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ImagesService } from '../../../_services/images.service';
import { MessageService } from '../../../_services/error-service.service';
import { PageEvent } from '@angular/material/paginator';
import { ImageComment } from 'src/app/model/image-comment';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-comment',
  templateUrl: './image-comment.component.html',
  styleUrls: ['./image-comment.component.scss']
})
export class ImageCommentComponent implements OnInit {
  length = 100;
  pageSize = 10;
  pageIndex=1;
  totalPages=0;
  comments: Array<ImageComment>
  pageEvent: PageEvent;

  @Input() imageId: number;
  @Input() private commentAdded: EventEmitter<boolean>;

  constructor(private imagesService: ImagesService,
              private messageService: MessageService,
              private router: Router) {
                this.comments = new Array<ImageComment>();
              }

  ngOnInit(): void {
    if (this.commentAdded) {
      this.commentAdded.subscribe(data => {
        this.getNewComments(1, this.pageSize);
      });
    }
    this.getComments(1, this.pageSize);
  }

  getComments(page: number, size: number){
    this.imagesService.getCommentsForImage(this.imageId, page, size).subscribe(
      (data) => {
        this.comments = this.comments.concat(data.comments)
        this.length = data.totalItems
        this.pageIndex = page;
        this.totalPages = data.totalPages;
      },
      (err) => {
        this.messageService.showError(err);
      },
    );
  }

  getNewComments(page: number, size: number){
    this.imagesService.getCommentsForImage(this.imageId, page, size).subscribe(
      (data) => {
        this.comments = data.comments
        this.length = data.totalItems
        this.pageIndex = page;
        this.totalPages = data.totalPages;
      },
      (err) => {
        this.messageService.showError(err);
      },
    );
  }

  onProfilePictureClick(nickname:string)
  {
    this.router.navigateByUrl('users/' + nickname);
  }

  onScroll()
  {
    if (this.totalPages > this.pageIndex)
      this.getComments(this.pageIndex + 1, this.pageSize)
  }
}
