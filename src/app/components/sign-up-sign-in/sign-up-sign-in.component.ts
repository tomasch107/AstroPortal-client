import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { AuthService } from '../../../_services/auth.service';

@Component({
  selector: 'app-sign-up-sign-in',
  templateUrl: './sign-up-sign-in.component.html',
  styleUrls: ['./sign-up-sign-in.component.scss'],
})
export class SignUpSignInComponent implements OnInit {
  formLogIn: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  formSignUp: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {}

  onSignUpClick(): void {
    const container = document.getElementById('container-sign');
    container.classList.add('right-panel-active');
  }
  onSignInMobileClick(): void {
    const container = document.getElementById('container-sign');
    container.classList.remove('right-panel-mobile-active');
  }
  onSignUpMobileClick(): void {
    const container = document.getElementById('container-sign');
    container.classList.add('right-panel-mobile-active');
  }
  onSignInClick(): void {
    const container = document.getElementById('container-sign');
    container.classList.remove('right-panel-active');
  }

  onLoginSubmit(): void {
    this.authService.login(this.formLogIn).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      err => {
        this.errorMessage = "Bad credentials"
        this.isLoginFailed = true;
      }
    );
  }
  onSignUpSubmit(): void {
    this.authService.register(this.formSignUp).subscribe(
      data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
  reloadPage(): void {
    window.location.reload();
  }
}
