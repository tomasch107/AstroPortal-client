import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/helpers/app-settings';
import { Observable } from 'rxjs';

const API_URL = AppSettings.API_ENDPOINT

@Injectable({
  providedIn: 'root'
})
export class ConversationService {


  constructor(private http: HttpClient) { }


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
}
