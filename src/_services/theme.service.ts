import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public themeChanged$: EventEmitter<string>;
  private theme: string;
  public setTheme(theme: string){
    this.themeChanged$.emit(theme);
    this.theme = theme;
  }
  public getTheme(): string{
    return this.theme;
  }
  constructor(
  ) { this.themeChanged$ = new EventEmitter();
      this.theme = localStorage.getItem('theme') === "Dark" ? "Dark" : "White";
  }
}
