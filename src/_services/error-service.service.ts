import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorWindowComponent } from '../app/components/error-window/error-window.component';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(public dialog: MatDialog) { }

  showErrorWindow(message :string){
    const dialogRef = this.dialog.open(ErrorWindowComponent, {
      panelClass: 'errorWindow',
      data: {
        message: message,
        yesNo: false
      }
    });
  }

  showError(err :any){

    let message = err.error.message;
    const dialogRef = this.dialog.open(ErrorWindowComponent, {
      panelClass: 'errorWindow',
      data: {
        message: message,
        yesNo: false
      }
    });
  }

  showYesNoWindow(message :string): Observable<any>{
    const dialogRef = this.dialog.open(ErrorWindowComponent, {
      panelClass: 'errorWindow',
      data: {
        message: message,
        yesNo: true
      },
    });

    return dialogRef.afterClosed();
  }
}
