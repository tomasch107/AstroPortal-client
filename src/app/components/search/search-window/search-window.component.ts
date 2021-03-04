import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../../../_services/search.service';
import { Observable, of } from 'rxjs';
import { ImageData } from 'src/app/model/image-data';
import { MessageService } from 'src/_services/error-service.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search-window',
  templateUrl: './search-window.component.html',
  styleUrls: ['./search-window.component.scss']
})
export class SearchWindowComponent implements OnInit {
  images: Array<ImageData>
  loading = false;
  pageIndex: number=1;
  length = 100;
  pageSize = 20;
  pageEvent: PageEvent;
  totalPages=0;
  searchRequestData;

  constructor(private searchService: SearchService,
              private messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute,
              ) {this.images = new Array<ImageData>();}

  ngOnInit(): void {
    const { pageIndex, pageSize } = this.getParamsFromRoute();
    if (pageIndex && pageSize)
    {
      for (let i = 0; i <= pageIndex; i++) {
        this.onSearch(this.searchRequestData, i, pageSize)
      }
    }
  }

  private getParamsFromRoute() {
    const params = this.route.snapshot.queryParams;
    const text = params['text'];
    const pageIndex = params['pageIndex'];
    const pageSize = params['pageSize'];
    const description = params['description'];
    const telescope = params['telescope'];
    const camera = params['camera'];
    const mount = params['mount'];
    const filters = params['filters'];
    const location = params['location'];
    const object = params['object'];
    const nickname = params['nickname'];

    this.searchRequestData = new Object();
    if (text)
      this.searchRequestData.text = text;
    if (description)
      this.searchRequestData.description = description;
    if (telescope)
      this.searchRequestData.telescope = telescope;
    if (camera)
    this.searchRequestData.camera = camera;
      if (mount)
    this.searchRequestData.mount = mount;
      if (filters)
    this.searchRequestData.filters = filters;
    if (location)
      this.searchRequestData.location = location;
    if (object)
      this.searchRequestData.object = object;
    if (nickname)
      this.searchRequestData.nickname = nickname;
    return { pageIndex, pageSize };
  }

  onNewSearch(searchEvent, pageIndex: number, pageSize)
  {
    this.images = new Array<ImageData>();
    this.onSearch(searchEvent, pageIndex, pageSize)
  }

  onSearch(searchEvent, pageIndex: number, pageSize)
  {
    this.pageIndex = pageIndex;
    this.searchRequestData = searchEvent;
    this.loading = true;
    this.searchService.search(searchEvent, pageIndex, pageSize).subscribe(
      (data) => {
        this.images = this.images.concat(data.images);
        this.length = data.totalItems
        this.totalPages = data.totalPages
        this.myMethodChangingQueryParams();
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

  public myMethodChangingQueryParams() {
    const queryParams: Params = { text: this.searchRequestData.text,
                                  title: this.searchRequestData.title,
                                  description: this.searchRequestData.description,
                                  telescope: this.searchRequestData.telescope,
                                  camera: this.searchRequestData.camera,
                                  mount: this.searchRequestData.mount,
                                  filters: this.searchRequestData.filters,
                                  location: this.searchRequestData.location,
                                  object: this.searchRequestData.object,
                                  pageSize: this.pageSize,
                                  pageIndex: this.pageIndex,
                                  nickname: this.searchRequestData.nickname
    };
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });
  }
  onScroll() {
    var nextPage = parseInt(this.pageIndex.toString()) + parseInt('1')
    if (nextPage < this.totalPages)
      this.onSearch(this.searchRequestData, parseInt(this.pageIndex.toString()) + parseInt('1'), this.pageSize);
  }
}
