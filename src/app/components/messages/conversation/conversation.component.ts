import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { FollowingComponent } from '../../following/following.component';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { ConversationService } from '../../../../_services/conversation.service';
import { MessageService } from '../../../../_services/error-service.service';
import { Conversation } from 'src/app/model/conversation';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
   opened= true;
  showFiller = false;
  conversationId;
  profileId;
  watchedProfiles;
  newConversation: Conversation;

  constructor(public dialog: MatDialog,
              private tokenService: TokenStorageService,
              private conversationService: ConversationService,
              private messageService: MessageService) { }

  ngOnInit(): void {
   this.profileId = + this.tokenService.getCurrentProfileId()

  }
  onConversationIdChange(event){
    this.conversationId = event;
  }

  createNewConverstaion(){
    const dialogRef = this.dialog.open(FollowingComponent, {
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data){
        var watchedProfilesId: Array<number> = new Array();
        data.forEach(element => {
          watchedProfilesId.push(element._value.watchedUserProfileId);
        });
        this.conversationService.createConversation(watchedProfilesId, this.profileId).subscribe(data => {
          this.newConversation = data;
        },
        (err) => {
          this.messageService.showError(err);
        })
      }
    })
  }
}
