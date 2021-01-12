import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TokenStorageService } from 'src/_services/token-storage.service';
import { SignUpSignInComponent } from './components/sign-up-sign-in/sign-up-sign-in.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  lang: string;
  constructor(
    private tokenStorageService: TokenStorageService,
    public dialog: MatDialog,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'pl']);
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('language');
    if(this.lang == null)
    {
      this.lang = this.translate.getDefaultLang();
    }
    this.translate.use(this.lang);

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  onProfileClick(): void {
    if (this.isLoggedIn) {
      window.location.href = '/profile';
    } else {
      this.openSignInComponent();
    }
  }

  openSignInComponent(): void {
    const dialogRef = this.dialog.open(SignUpSignInComponent, {
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  switchLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }
}
