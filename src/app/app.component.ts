import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TokenStorageService } from 'src/_services/token-storage.service';
import { SignUpSignInComponent } from './components/sign-up-sign-in/sign-up-sign-in.component';
import { TranslateService } from '@ngx-translate/core';
import { LangIconValues } from './model/lang-icon-values';
import { ThemeService } from '../_services/theme.service';

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
  isDarkTheme: boolean = false;
  nodeType: any;
  nodeTypes: LangIconValues[] = [];
  title = 'AstroPortal';

  constructor(
    private tokenStorageService: TokenStorageService,
    public dialog: MatDialog,
    public translate: TranslateService,
    private renderer: Renderer2,
    private themeService: ThemeService
  ) {
    translate.addLangs(['en', 'pl']);
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {

    this.isDarkTheme = localStorage.getItem('theme') === "Dark" ? true : false;
    this.storeThemeSelection();
    this.configureLanguage();

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }
  }

  private configureLanguage() {
    this.lang = localStorage.getItem('language');
    if (this.lang == null) {
      this.lang = this.translate.getDefaultLang();
    }
    this.translate.use(this.lang);

    this.translate.getLangs().forEach(lang => {
      this.nodeTypes.push({
        value: lang,
        iconHtml: '<img src="../assets/SVGs/flags/' + lang + '.svg" width="25" alt="" class="d-inline-block align-middle mr-2">',
        description: this.getLangDescription(lang)
      });
    });
    this.nodeType = this.nodeTypes.find(value => value.value === this.lang);
  }

  getLangDescription(langKey: string): string{
      if(langKey === 'en')
          return 'English'
      if(langKey === 'pl')
        return 'Polish'
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.href = '/home';
  }

  onProfileClick(): void {
    if (this.isLoggedIn) {
      window.location.href = '/profile';
    } else {
      this.openSignInComponent();
    }
  }

  onProfileMenuClick(){
    if (!this.isLoggedIn)
    this.openSignInComponent();
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

  storeThemeSelection() {
    if(this.isDarkTheme)
      this.renderer.addClass(document.body, 'dark-theme-mode');
    else
      this.renderer.removeClass(document.body, 'dark-theme-mode');
    localStorage.setItem('theme', this.isDarkTheme ? "Dark" : "Light");
    this.themeService.setTheme(this.isDarkTheme ? "Dark" : "Light");

  }
}
