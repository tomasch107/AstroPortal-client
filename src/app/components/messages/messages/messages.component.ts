import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ConversationService } from '../../../../_services/conversation.service';
import { MessageService } from '../../../../_services/error-service.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { Observable, of } from 'rxjs';
import { Message } from 'src/app/model/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @Input() conversationId: number;
  conversationIdChanged=false;
  loading = false;
  length = 100;
  pageSize = 50;
  pageSizeOptions: number[] = [25, 50, 100];
  pageEvent: PageEvent;
  totalPages;
  profileId;
  pageIndex;
  messages: Observable<Array<Message>>;
  formGroup: FormGroup;


  constructor(private conversationService: ConversationService,
    private messageService: MessageService,
    private tokenStorageService: TokenStorageService,
    private formBuilder: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges){
    this.onConversationChange(changes.conversationId.currentValue);
  }
  ngOnInit(): void {
    this.profileId = + this.tokenStorageService.getCurrentProfileId();
    this.createForm();
  }
  onConversationChange(conversationId: number){
    if (this.profileId == null || conversationId == null)
      return;
      this.loading = true;
    this.conversationService.getMessages(conversationId,this.profileId, 0, this.pageSize).subscribe(data => {
      this.totalPages = data.totalPages;
      let newPageEvent: PageEvent = new PageEvent();
      if (!this.pageEvent)
      {
        newPageEvent.pageIndex =  this.totalPages != 0 ? this.totalPages-1: 0;
        newPageEvent.pageSize = this.pageSize;
      }
      else
        newPageEvent = this.pageEvent;
      this.onPageEvent(newPageEvent);
    },
    (err) => {
      this.messageService.showError(err);
    },
    () => (this.loading = false))
    this.conversationIdChanged=true;
  }

  onPageEvent(pageEvent: PageEvent)
  {
    this.pageEvent = pageEvent;
    this.pageSize = pageEvent.pageSize;
    this.loading = true;
    this.getMessages(this.conversationId, this.profileId, pageEvent.pageIndex, pageEvent.pageSize);
  }

  getMessages(conversationId, profileId, page, size)
  {
    if (profileId == null || conversationId == null)
      return;
    this.conversationService.getMessages(conversationId,profileId,page,size).subscribe(data => {
      this.totalPages = data.totalPages;
      this.length = data.totalItems
      this.pageIndex = page;
      this.messages = of(data.messages);
      console.log(data);
    },
    (err) => {
      this.messageService.showError(err);
    },
    () => (this.loading = false))
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      messageText: [null, [Validators.maxLength(1000), Validators.required]],
    });
  }

  onSubmit(post) {
    post.userProfileId = this.profileId;
    post.conversationId = this.conversationId;
    this.conversationService.sendMessage(post).subscribe(data => {
      this.getMessages(this.conversationId, this.profileId, this.pageEvent.pageIndex, this.pageEvent.pageSize);
    },
    (err) => {
      this.messageService.showError(err);
    })
    this.formGroup.reset();
  }
}
