import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/_services/user.service';
import {MatDialog} from '@angular/material/dialog';
import { SignUpSignInComponent } from '../sign-up-sign-in/sign-up-sign-in.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  content: string;

  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }
  onGetStartedClick() {
    let dialogRef = this.dialog.open(SignUpSignInComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
