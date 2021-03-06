import { ConversationService } from './../../../../_services/conversation.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MessageService } from '../../../../_services/error-service.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Conversation } from '../../../model/conversation';

@Component({
  selector: 'app-change-conversation-name',
  templateUrl: './change-conversation-name.component.html',
  styleUrls: ['./change-conversation-name.component.scss']
})
export class ChangeConversationNameComponent implements OnInit {
  @Input() conversation: Conversation;
  @Input() profileId;
  formGroup: FormGroup;
  conversationName='';

  constructor(private conversationService: ConversationService,
    private tokenStorageService: TokenStorageService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ChangeConversationNameComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogInData: {conversation: Conversation,
    profileId: number}) { }

  ngOnInit(): void {
    if (this.dialogInData.conversation)
    {
      this.conversation = this.dialogInData.conversation;
      this.profileId = this.dialogInData.profileId;
    }
    this.createForm();
    this.formGroup.controls['conversationName'].setValue(this.conversation.name);
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      conversationName: [null, [Validators.required, Validators.maxLength(255)]],
    });
  }

  changeName(form){
    this.conversationService.changeConversationName(this.conversation.id, this.profileId, form.conversationName).subscribe(data => {
        this.dialogRef.close(data);
    },
    (err) => {
      this.messageService.showError(err);
    })
  }
}
