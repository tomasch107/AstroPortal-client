import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const PROFILE_ID = 'current-profile-id';
const PROFILE_NICKNAME = 'current-profile-nickname';


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.saveCurrentProfileId(user.defaultProfileId)
    this.saveCurrentProfileNickname(user.profileNickname)
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  public saveCurrentProfileId(profileId: string): void {
    localStorage.setItem(PROFILE_ID, profileId);
  }


  public getCurrentProfileId(): string {
    return localStorage.getItem(PROFILE_ID);
  }

  public saveCurrentProfileNickname(profileNickname: string)
  {
    localStorage.setItem(PROFILE_NICKNAME, profileNickname)
  }

  public getCurrentNickname(): string {
    return localStorage.getItem(PROFILE_NICKNAME);
  }
}
