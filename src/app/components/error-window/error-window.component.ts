import { Component, OnInit, Inject } from '@angular/core';
import { ErrorData } from '../../model/error-data';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-error-window',
  templateUrl: './error-window.component.html',
  styleUrls: ['./error-window.component.scss']
})
export class ErrorWindowComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorData) { }

  ngOnInit(): void {
  }

}
