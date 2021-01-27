import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from '../app/helpers/app-settings';
import { Observable } from 'rxjs';
import { ImageData } from 'src/app/model/image-data';
import { UserProfile } from '../app/model/user-profile';

const API_URL = AppSettings.API_ENDPOINT

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http: HttpClient) {

  }
  uploadImage(imageData: ImageData,  file: File): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();

    formData.append('file', file);
    const myObjStr = JSON.stringify(imageData);
    const imageBlob = new Blob([myObjStr],{ type: "application/json"});
    formData.append('image', imageBlob);
    const req = new HttpRequest('POST', API_URL + 'images/uploadImage', formData, {
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getImageByIdAndUsername(id: number, username: string): Observable<ImageData>{
    return this.http.get<ImageData>(API_URL + 'images/getByIdAndUsername/' + id + "/" + username);
  }

  getUserPublicData(username: string): Observable<any>
  {
    return this.http.get(API_URL + 'images/getUserPublicData/' + username);
  }
}
