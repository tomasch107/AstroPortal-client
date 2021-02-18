import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app/helpers/app-settings';
import { UserProfile } from '../app/model/user-profile';

const API_URL = AppSettings.API_ENDPOINT

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'test/all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'test/user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'test/mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'test/admin', { responseType: 'text' });
  }

  getUsers(): Observable<any> {
    return this.http.get(API_URL + 'admin/getUsers', { responseType: 'text' });
  }

  getUserData(): Observable<UserProfile> {
    return this.http.get<UserProfile>(API_URL + 'user/getUserData');
  }

  saveUserData(profileData: UserProfile): Observable<any> {
    return this.http.post(API_URL + 'user/saveUserData', profileData);
  }

  uploadProfilePicture(file: File, profileId): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', API_URL + 'user/updateProfilePicture/' + profileId, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  addLikeToImage(watchedProfileId: number, watchingProfileId: number)
  {
    return this.http.post<any>(API_URL + 'user/watchUser/' + watchedProfileId + '/' + watchingProfileId, {});
  }
  removeLikeFromImage(watchedProfileId: number, watchingProfileId: number)
  {
    return this.http.post<any>(API_URL + 'user/unwatchUser/' + watchedProfileId + '/' + watchingProfileId, {});
  }
  isImageLiked(watchedProfileId: number, watchingProfileId: number)
  {
    return this.http.get<boolean>(API_URL + 'user/isUserWatched/' + watchedProfileId + '/' + watchingProfileId,);
  }
}



