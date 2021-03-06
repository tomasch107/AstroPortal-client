import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { ConversationService } from '../../../../_services/conversation.service';
import { MessageService } from '../../../../_services/error-service.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { Observable, of } from 'rxjs';
import { Message } from 'src/app/model/message';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Conversation } from 'src/app/model/conversation';
import { MatDialog } from '@angular/material/dialog';
import { ChangeConversationNameComponent } from '../change-conversation-name/change-conversation-name.component';
import { ConversationParticipantsComponent } from '../conversation-participants/conversation-participants.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @Input() conversation: Conversation;
  @Input() conversationId: number;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('formDirective') private formDirective: NgForm;

  conversationIdChanged=false;
  loading = false;
  length = 100;
  pageSize = 8;
  pageSizeOptions: number[] = [25, 50, 100];
  totalPages;
  profileId;
  pageIndex;
  messages: Array<Message>;
  newMessages: Array<Message>;
  formGroup: FormGroup;
  disableScrollDown = false

  constructor(private conversationService: ConversationService,
    private messageService: MessageService,
    private tokenStorageService: TokenStorageService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) {
      this.messages = new Array<Message>();
      this.newMessages = new Array<Message>();
     }

  ngOnChanges(changes: SimpleChanges){
    this.onConversationChange(changes.conversation.currentValue);
  }
  ngOnInit(): void {
    this.profileId = + this.tokenStorageService.getCurrentProfileId();
    this.createForm();
    this.scrollToBottom()
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onConversationChange(conversation: Conversation){
    if (this.profileId == null || conversation == null)
      return;
      let conversationId = conversation.id

      this.loading = true;
      this.disableScrollDown = false;
    this.conversationService.getMessages(conversationId,this.profileId, 0, this.pageSize).subscribe(data => {
      this.totalPages = data.totalPages;
        this.messages = new Array<Message>();
        let pageIndex =  this.totalPages != 0 ? this.totalPages-1: 0;
        this.getMessages(conversationId, this.profileId, pageIndex, this.pageSize);

    },
    (err) => {
      this.messageService.showError(err);
    },
    () => (this.loading = false))
    this.conversationIdChanged=true;
  }

  getNewMessages(conversationId, profileId, page, size)
  {
    if (profileId == null || conversationId == null || page < -1)
      return;
    this.loading = true;
    this.onConversationChange(this.conversation);
  }
  getMessages(conversationId, profileId, page, size)
  {
    if (profileId == null || conversationId == null || page < -1)
      return;
    this.loading = true;

    this.conversationService.getMessages(conversationId,profileId,page,size).subscribe(data => {
      this.conversationService.updateUnreadConversationCount(this.profileId);
      this.totalPages = data.totalPages;
      this.length = data.totalItems
      this.pageIndex = page;
      this.newMessages = data.messages;
      this.messages =  this.newMessages.concat(this.messages);
      if(this.messages.length < 8 && this.pageIndex > 0){
        this.getMessages(conversationId, profileId, this.pageIndex -1, size);
      }
    },
    (err) => {
      this.messageService.showError(err);
    },
    () => {
      this.loading = false;
    });
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      messageText: [null, [Validators.maxLength(1000), Validators.required]],
    });
  }

  onSubmit(post) {
    this.disableScrollDown = false;

    post.userProfileId = this.profileId;
    post.conversationId = this.conversationId;
    this.conversationService.sendMessage(post).subscribe(data => {
      this.getNewMessages(this.conversationId, this.profileId, this.pageIndex, this.pageSize);
    },
    (err) => {
      this.messageService.showError(err);
    })
    this.formGroup.reset();
    this.formDirective.resetForm();

  }

  onScroll(){
    this.disableScrollDown = true;
    if (this.pageIndex > 0)
      this.getMessages(this.conversationId, this.profileId, this.pageIndex -1, this.pageSize);
  }
  private scrollToBottom(): void {
    if (this.disableScrollDown) {
        return
    }
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
}

vievConversationUsers(){
  const dialogRef = this.dialog.open(ConversationParticipantsComponent, {
    panelClass: 'dialog-scroll',
    data: {
      conversation: this.conversation,
      profileId: this.profileId
    },
  });
}

changeConversationName(){
  const dialogRef = this.dialog.open(ChangeConversationNameComponent, {
    panelClass: 'dialog-scroll',
    data: {
      conversation: this.conversation,
      profileId: this.profileId
    },
  });

  dialogRef.afterClosed().subscribe( data => {
      if (data.id)
        this.conversationService.conversationChanged$.emit(data);
  });
}

getConversationName(conversation: Conversation) :string{
  var conversationName;
  if (conversation.participants.length === 2)
  {
  for (let entry of conversation.participants) {
    if (entry.id !== this.profileId)
    {
      conversationName = entry.nickname
    }
  }
}
if (conversation.participants.length === 1)
  conversationName = conversation.participants[0].nickname
if (conversation.participants.length > 2)
    conversationName = conversation.name;

  return conversationName;
}
}
