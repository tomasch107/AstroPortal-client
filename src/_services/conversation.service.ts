import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/helpers/app-settings';
import { Observable } from 'rxjs';
import { Conversation } from '../app/model/conversation';

const API_URL = AppSettings.API_ENDPOINT

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  public conversationChanged$: EventEmitter<Conversation>;

  public unReadConversationIdUpdate$: EventEmitter<number>;
  private unReadConversationId: number[] = [];

  constructor(private http: HttpClient) {
    this.unReadConversationIdUpdate$ = new EventEmitter();
    this.conversationChanged$ = new EventEmitter();
  }

  getMessages(conversationId:number, profileId: number, page: number, size: number)
  {
    var body: any= new Object();
    body.conversationId = conversationId;
    body.profileId = profileId;
    body.size=size;
    body.page=page;

    return this.http.post<any>(API_URL + 'conversation/getMessages', body);
  }

  getConversations(profileId: number)
  {
    return this.http.post<any>(API_URL + 'conversation/getConversations', profileId);
  }

  sendMessage(messageRequest){
    return this.http.post<any>(API_URL + 'conversation/sendMessage', messageRequest);
  }

  createConversation(watchedUserProfilesId, creatorId){
    var conversationRequest: any = new Object();
    conversationRequest.creatorId = creatorId
    conversationRequest.participants = watchedUserProfilesId
    return this.http.post<any>(API_URL + 'conversation/createConversation', conversationRequest);
  }

  updateUnreadConversationCount(profileId: number){
    this.http.post<any>(API_URL + 'conversation/getUnReadConversationCount', profileId).subscribe(data=> {
      this.unReadConversationId = data
      this.unReadConversationIdUpdate$.emit(0);
    });
  }

  removeFromUnReadConversationList(id: number)
  {
    for (let entry of this.unReadConversationId) {
      if (entry === id)
      {
        let index = this.unReadConversationId.indexOf(id)
        this.unReadConversationId.splice(index, 1);
        this.unReadConversationIdUpdate$.emit(id);
      }
    }
  }

  getUnreadConversationList(){
    return this.unReadConversationId;
  }

  getUnreadConversationCount(){
    return this.unReadConversationId.length;
  }

  changeConversationName(conversationId, profileId, conversationName){
    let params: any = {};
    params[`conversationId`] = conversationId;
    params[`conversationName`] = conversationName;
    params[`userProfileId`] = profileId;
    return this.http.get<any>(API_URL + 'conversation/changeConversationName', { params });
  }

  getConversationParticipants(conversationId, profileId){
    let params: any = {};
    params[`conversationId`] = conversationId;
    params[`userProfileId`] = profileId;
    return this.http.get<any>(API_URL + 'conversation/getConversationParticipants', { params });
  }
}
