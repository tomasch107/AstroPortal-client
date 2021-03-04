import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { AppSettings } from 'src/app/helpers/app-settings';
import { SearchParams } from '../app/model/search-params';
import { HttpClient } from '@angular/common/http';

const API_URL = AppSettings.API_ENDPOINT

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }


  search(searchParams: SearchParams, page: number, size: number)
  {
    const params = this.getRequestParams(searchParams, page, size);

    return this.http.get<any>(API_URL + 'search/search', { params });
  }

  getRequestParams (searchParams: SearchParams, page: number, size: number): Params {
    let params: any = {};
    if (page) {
      params[`page`] = page;
    }
    if (size) {
      params[`size`] = size;
    }
    if (searchParams.text) {
      params[`text`] = searchParams.text;
      return params;
    }
    if (searchParams.title) {
      params[`title`] = searchParams.title;
    }
    if (searchParams.description) {
      params[`description`] = searchParams.description;
    }
    if (searchParams.telescope) {
      params[`telescope`] = searchParams.telescope;
    }
    if (searchParams.camera) {
      params[`camera`] = searchParams.camera;
    }
    if (searchParams.mount) {
      params[`mount`] = searchParams.mount;
    }
    if (searchParams.filters) {
      params[`filters`] = searchParams.filters;
    }
    if (searchParams.location) {
      params[`location`] = searchParams.location;
    }
    if (searchParams.object) {
      params[`object`] = searchParams.object;
    }


    return params;
  }

  getObservedImages(profileId:number, page: number, size: number){
    let params: any = {};
      params[`page`] = page;
      params[`size`] = size;
      params[`userProfileId`] = profileId;

      return this.http.get<any>(API_URL + 'search/getObservedImages', { params });
  }


  getNewestImages(page: number, size: number){
    let params: any = {};
      params[`page`] = page;
      params[`size`] = size;

      return this.http.get<any>(API_URL + 'search/getNewestImages', { params });
  }
}
