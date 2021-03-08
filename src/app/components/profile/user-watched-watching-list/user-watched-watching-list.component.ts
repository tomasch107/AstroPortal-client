import { Component, Inject, OnInit } from '@angular/core';
import { UserProfile } from 'src/app/model/user-profile';
import { ConversationService } from '../../../../_services/conversation.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { MessageService } from '../../../../_services/error-service.service';
import { Router } from '@angular/router';
import { ConversationParticipantsComponent } from '../../messages/conversation-participants/conversation-participants.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../../_services/user.service';

@Component({
  selector: 'app-user-watched-watching-list',
  templateUrl: './user-watched-watching-list.component.html',
  styleUrls: ['./user-watched-watching-list.component.scss']
})
export class UserWatchedWatchingListComponent implements OnInit {
  nickname='';
  users: Array<UserProfile>;
  pageSize = 25;
  currentPage = 0;
  totalItems = 0;
  totalPages = 0;
  loading = false;
  constructor(private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    public dialogRef: MatDialogRef<UserWatchedWatchingListComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogInData: {profileId: number,
      watched: boolean}) {
      this.users = new Array<UserProfile> ();
    }

  ngOnInit(): void {
    if (this.dialogInData.watched)
      this.getWatched(0);
    else
    this.getWatching(0);
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
    if (this.dialogInData.watched)
      this.getWatched(nextPage);
    else
      this.getWatching(nextPage);
  }

  private getWatched(pageIndex: number) {
    this.loading = true;
    this.userService.getWatchedUsersPaging(this.dialogInData.profileId, pageIndex, this.pageSize).subscribe(
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

  private getWatching(pageIndex: number) {
    this.loading = true;
    this.userService.getWatchingUsersPaging(this.dialogInData.profileId, pageIndex, this.pageSize).subscribe(
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
}
