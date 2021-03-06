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
  @Output() conversationChange = new EventEmitter<Conversation>();
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

    this.conversationService.conversationChanged$.subscribe(data => {
      for (let entry of this.conversations) {
        if (entry.id === data.id)
        {
          entry.name = data.name;
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges){
    this.onNewConversation(changes.newConversation.currentValue);
  }

  onSelectionChange(event)
  {
    let conversation = event.option._value;

    let id = event.option._value.id;
    this.conversationChange.emit(conversation);


    for (let entry of this.conversations) {
      if (entry.id === id)
      {
        let index = entry.readId.indexOf(this.profileId)
        entry.readId.splice(index, 1);
      }
    }

    this.conversationService.updateUnreadConversationCount(this.profileId);
  }
  onNewConversation(newConversation)
  {
    if(newConversation)
    {
      if (!this.conversations.find(value => value.id === newConversation.id))
        {
          this.conversations.unshift(newConversation);
        }
        this.conversationChange.emit(newConversation);
    }
  }

  isConversationRead(conversation){
    let array: Array<number> = conversation.readId;

    for (let entry of array) {
      if (entry === this.profileId)
      {
        console.log(entry);
        return true;
      }
    }
    return false;
  }
}
