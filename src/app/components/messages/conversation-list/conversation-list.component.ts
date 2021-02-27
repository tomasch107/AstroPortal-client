import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConversationService } from '../../../../_services/conversation.service';
import { Observable, of } from 'rxjs';
import { Conversation } from 'src/app/model/conversation';
import { Output, EventEmitter } from '@angular/core';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { MessageService } from '../../../../_services/error-service.service';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit {
  conversations: Conversation[];
  profileId: number;
  selectedOptions;
  @Output() conversationChange = new EventEmitter<number>();
  @Input() newConversation: Conversation;

  constructor(private conversationService: ConversationService,
    private tokenStorageService: TokenStorageService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.profileId = + this.tokenStorageService.getCurrentProfileId();
    this.conversationService.getConversations(this.profileId).subscribe(data => {
      this.conversations = data;
    },
    (err) => {
      this.messageService.showError(err);
    })
  }

  ngOnChanges(changes: SimpleChanges){
    this.onNewConversation(changes.newConversation.currentValue);
  }

  onSelectionChange(event)
  {
    this.conversationChange.emit(event.option._value.id);
  }
  onNewConversation(newConversation)
  {
    if(newConversation)
    {
      if (!this.conversations.find(value => value.id === newConversation.id))
        {
          this.conversations.unshift(newConversation);
        }
        this.conversationChange.emit(newConversation.id);
    }
  }
}
