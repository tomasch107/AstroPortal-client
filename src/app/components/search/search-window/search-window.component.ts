import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../../../_services/search.service';
import { Observable, of } from 'rxjs';
import { ImageData } from 'src/app/model/image-data';
import { MessageService } from 'src/_services/error-service.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search-window',
  templateUrl: './search-window.component.html',
  styleUrls: ['./search-window.component.scss']
})
export class SearchWindowComponent implements OnInit {
  images: Observable<Array<ImageData>>
  loading = false;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  searchRequestData;

  constructor(private searchService: SearchService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onSearch(event, pageIndex, pageSize)
  {
    this.searchRequestData = event;
    this.loading = true;
    this.searchService.search(event, pageIndex, pageSize).subscribe(
      (data) => {
        this.images = of(data.images);
        this.length = data.totalItems
      },
      (err) => {
        this.messageService.showError(err);
      },
      () => (this.loading = false)
    );
  }

  onImageClick(image: ImageData){
    this.router.navigateByUrl('users/' + image.userProfileNickname + '/' + image.id);
  }

  onPageEvent(pageEvent: PageEvent)
  {
    this.pageEvent = pageEvent;
    if(this.searchRequestData == undefined)
      this.searchRequestData.text = '';
    this.onSearch(this.searchRequestData, pageEvent.pageIndex, pageEvent.pageSize);
  }

}
