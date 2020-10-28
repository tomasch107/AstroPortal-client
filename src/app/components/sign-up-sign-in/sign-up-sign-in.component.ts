import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up-sign-in',
  templateUrl: './sign-up-sign-in.component.html',
  styleUrls: ['./sign-up-sign-in.component.scss'],
})
export class SignUpSignInComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onSignUpClick(): void {
    const container = document.getElementById('container-sign');
    container.classList.add('right-panel-active');
  }
  onSignInClick(): void {
    const container = document.getElementById('container-sign');
    container.classList.remove('right-panel-active');
  }
}
