import { Component, Input, OnInit } from '@angular/core';
import { ImageData } from 'src/app/model/image-data';

@Component({
  selector: 'app-image-description',
  templateUrl: './image-description.component.html',
  styleUrls: ['./image-description.component.scss']
})
export class ImageDescriptionComponent implements OnInit {

  @Input() imageData: ImageData;
  constructor() { }

  ngOnInit(): void {
  }

}
