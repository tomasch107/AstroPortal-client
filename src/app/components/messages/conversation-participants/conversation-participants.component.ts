import { Component, OnInit, Input, Inject } from '@angular/core';
import { MessageService } from 'src/_services/error-service.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { ConversationService } from '../../../../_services/conversation.service';
import { UserProfile } from 'src/app/model/user-profile';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Conversation } from 'src/app/model/conversation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversation-participants',
  templateUrl: './conversation-participants.component.html',
  styleUrls: ['./conversation-participants.component.scss']
})
export class ConversationParticipantsComponent implements OnInit {
  participants: Array<UserProfile>
  @Input() conversation : Conversation;
  @Input() profileId: number;
  constructor(private conversationService: ConversationService,
    private tokenStorageService: TokenStorageService,
    private messageService: MessageService,
    private router: Router,
    public dialogRef: MatDialogRef<ConversationParticipantsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogInData: {conversation: Conversation,
      profileId: number}) {
      this.participants = new Array<UserProfile> ();
    }

  ngOnInit(): void {

    if (this.dialogInData.conversation)
    {
      this.conversation = this.dialogInData.conversation;
      this.profileId = this.dialogInData.profileId;
      this.getParticipants();
    }
  }

  getParticipants(){
    this.conversationService.getConversationParticipants(this.conversation.id, this.profileId).subscribe(data => {
      this.participants = data;
    },
    (err) => {
      this.messageService.showError(err);
    })
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
}
