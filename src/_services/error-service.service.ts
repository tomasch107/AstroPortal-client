import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorWindowComponent } from '../app/components/error-window/error-window.component';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(public dialog: MatDialog,
    private translate: TranslateService) { }

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
    if(err.status === 401 || err.error.status === 401)
      message = this.translate.instant('UnauthorizedError');
    console.log(err);
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
