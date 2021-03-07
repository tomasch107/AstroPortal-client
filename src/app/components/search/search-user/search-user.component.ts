import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../../../model/user-profile';
import { SearchService } from '../../../../_services/search.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnInit {
  nickname='';
  users: Array<UserProfile>;
  pageSize = 25;
  currentPage = 0;
  totalItems = 0;
  totalPages = 0;
  loading = false;
  constructor(private searchService: SearchService,
    private router: Router,
    public dialogRef: MatDialogRef<SearchUserComponent>) {
    this.users = new Array<UserProfile>();
  }

  ngOnInit(): void {
  }

  onInputChange(event: string)
  {
      if(event.length > 0 && event.length < 50)
      {
        this.nickname = event;
        this.searchNewUser(event, 0);
      }
      else{
        this.users = new Array<UserProfile>();
      }
  }

  private searchUser(event: string, pageIndex: number) {
    this.loading = true;
    this.searchService.searchUsers(event, pageIndex, this.pageSize).subscribe(
      (data) => {
        this.currentPage = data.currentPage;
        this.totalItems = data.totalItems;
        this.users = this.users.concat(data.users);
        this.totalPages = data.totalPages;
      },
      (err) => {
        console.log(err);
      },
      () => (this.loading = false)
    );
  }

  private searchNewUser(event: string, pageIndex: number) {
    this.loading = true;
    this.searchService.searchUsers(event, pageIndex, this.pageSize).subscribe(
      (data) => {
        this.currentPage = data.currentPage;
        this.totalItems = data.totalItems;
        this.users = data.users;
        this.totalPages = data.totalPages;
      },
      (err) => {
        console.log(err);
      },
      () => (this.loading = false)
    );
  }

  onSelectionChange(event)
  {
    let profile = event.option._value;
    let nickname = profile.nickname

    if (nickname)
    {
      this.router.navigateByUrl('users/' + nickname);
      this.dialogRef.close()
    }
  }

  onScroll(){
    var nextPage = parseInt(this.currentPage.toString()) + parseInt('1')
    this.searchUser(this.nickname, nextPage);
  }
}
