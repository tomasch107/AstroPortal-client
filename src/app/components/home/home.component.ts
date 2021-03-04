import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/_services/user.service';
import { SignUpSignInComponent } from '../sign-up-sign-in/sign-up-sign-in.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  content: string;

  constructor(private userService: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {

  }
  onGetStartedClick() {
    const dialogRef = this.dialog.open(SignUpSignInComponent, {
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
