import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/_services/user.service';
import { SignUpSignInComponent } from '../sign-up-sign-in/sign-up-sign-in.component';
import { MatDialog } from '@angular/material/dialog';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { SearchService } from '../../../_services/search.service';
import { MessageService } from '../../../_services/error-service.service';
import { ImageData } from 'src/app/model/image-data';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  profileId;
  isLoggedIn = false;
  loading = false;
  images: Array<ImageData>;
  pageSize = 20;
  getAllImages = false;
  isFirstGettingAll = true;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  constructor(private userService: UserService,
     public dialog: MatDialog,
     private token: TokenStorageService,
     private searchService: SearchService,
     private messageService: MessageService) {

      this.images = new Array<ImageData>();
      this.currentPage = -1;
      }

  ngOnInit(): void {
    this.isLoggedIn = this.token.getToken() != null;
    this.profileId = + this.token.getCurrentProfileId();
  }
  onGetStartedClick() {
    const dialogRef = this.dialog.open(SignUpSignInComponent, {
      panelClass: 'custom-dialog'
    });
  }

  getObservedImages(page, pageSize)
  {
    this.loading = true;
    this.searchService.getObservedImages(this.profileId, page, pageSize).subscribe(data => {
      this.images = this.images.concat(data.images)
      this.currentPage = data.currentPage;
      this.totalItems = data.totalItems;
      this.totalPages = data.totalPages;
      if (this.images.length === this.totalItems)
      {
        this.getAllImages = true;
        console.log(this.totalItems)
      }
    },
    (err) => {
      this.messageService.showError(err);
    },
    () => {
      this.loading = false;
    });
  }
  onScroll(){
    if (this.isLoggedIn && !this.getAllImages)
      this.getObserved();
    else
      this.getAll();
  }

  getObserved(){
    var nextPage = parseInt(this.currentPage.toString()) + parseInt('1')
    if (!this.totalPages || nextPage < this.totalPages)
    {
      this.getObservedImages(nextPage, this.pageSize)
    }
  }

  getAll(){
    if(this.isFirstGettingAll)
      var nextPage = 0;
    else
      nextPage = parseInt(this.currentPage.toString()) + parseInt('1')

    if (this.isFirstGettingAll || (!this.totalItems || this.images.length < this.totalItems))
    {
      this.getNewestImages(nextPage , this.pageSize)
    }
  }

  getNewestImages(page, pageSize){
    this.loading = true;
    this.searchService.getNewestImages(page, pageSize).subscribe(data => {
      var newImages: Array<ImageData> = data.images;

      for (let entry of newImages) {
        if(!this.images.find(i => i.id === entry.id))
          this.images.push(entry)
      }
      this.isFirstGettingAll = false;
      this.currentPage = data.currentPage;
      this.totalItems = data.totalItems;
      this.totalPages = data.totalPages;

    },
    (err) => {
      this.messageService.showError(err);
    },
    () => {
      this.loading = false;
    });
  }
}
