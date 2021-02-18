import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from '../app/helpers/app-settings';
import { Observable } from 'rxjs';
import { ImageData } from 'src/app/model/image-data';
import { UserProfile } from '../app/model/user-profile';
import { TokenStorageService } from './token-storage.service';
import { ImageComment } from '../app/model/image-comment';
import { Params } from '@angular/router';

const API_URL = AppSettings.API_ENDPOINT

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http: HttpClient,
              private tokenStorageService: TokenStorageService) {

  }
  uploadImage(imageData: ImageData,  file: File): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();
    let profileId = this.tokenStorageService.getCurrentProfileId();
    formData.append('file', file);
    const myObjStr = JSON.stringify(imageData);
    const imageBlob = new Blob([myObjStr],{ type: "application/json"});
    formData.append('image', imageBlob);
    const req = new HttpRequest('POST', API_URL + 'images/uploadImage/' + profileId, formData, {
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getImageByIdAndUsername(id: number, username: string): Observable<ImageData>{
    return this.http.get<ImageData>(API_URL + 'images/getByIdAndUsername/' + id + "/" + username);
  }

  getUserPublicData(username: string): Observable<UserProfile>
  {
    return this.http.get<UserProfile>(API_URL + 'images/getUserPublicData/' + username);
  }

  getAllImagesByUsername(username: string): Observable<ImageData[]>{
    return this.http.get<ImageData[]>(API_URL + 'images/getAllImagesByUsername/' + username);
  }

  addComment(comment: ImageComment): Observable<ImageComment> {
    return this.http.post<ImageComment>(API_URL + 'images/addComment', comment);
  }

  getCommentsForImage(imageId: number, page: number, size: number)
  {
    const params = this.getRequestParams(imageId, page, size);

    return this.http.get<any>(API_URL + 'images/getComments', { params });
  }

  getRequestParams(imageId: number, page: number, pageSize: number): Params {
    let params: any = {};

    if (imageId) {
      params[`imageId`] = imageId;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  getNumberOfLikes(imageId: number)
  {
    return this.http.get<any>(API_URL + 'images/getImagePluses/' + imageId);
  }

  addLikeToImage(imageId: number, profileId: number)
  {
    return this.http.post<any>(API_URL + 'images/addPlusToImage/' + imageId + '/' + profileId, {});
  }
  removeLikeFromImage(imageId: number, profileId: number)
  {
    return this.http.post<any>(API_URL + 'images/removePlusFromImage/' + imageId + '/' + profileId, {});
  }
  isImageLiked(imageId: number, profileId: number)
  {
    return this.http.get<boolean>(API_URL + 'images/isImageLiked/' + imageId + '/' + profileId);
  }
}
