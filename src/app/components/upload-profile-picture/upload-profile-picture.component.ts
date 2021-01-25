import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UploadFileService } from '../../../_services/upload-file.service';
import { UserService } from '../../../_services/user.service';
import { ImageData } from '../../model/file-data';
import { MessageService } from '../../../_services/error-service.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-profile-picture',
  templateUrl: './upload-profile-picture.component.html',
  styleUrls: ['./upload-profile-picture.component.scss']
})
export class UploadProfilePictureComponent implements OnInit {
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';

  fileInfos: Observable<Array<ImageData>>;
  downloadUri: Observable<string>;
  imageData:   Array<ImageData>;
  imgLink: Observable<string>;
  isHovering: boolean;
  files: File[] = [];

  fileSelected=false;
  constructor(
    private uploadService: UploadFileService,
    private userProfileService: UserService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<UploadProfilePictureComponent>) {}


  onSelect(event) {
    this.files.splice(0)
    this.files.push(...event.addedFiles);
    this.fileSelected = true;
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.fileSelected = false;
  }
  ngOnInit(): void {
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress = 0;

    this.currentFile = this.files[0];
    this.userProfileService.uploadProfilePicture(this.currentFile).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.imageData = event.body;
          this.downloadUri = of(this.imageData[0].fileDownloadUri).pipe();
          this.dialogRef.close();
        }
      },
      (err) => {
        this.progress = 0;
        this.currentFile = undefined;
        console.log(err)
        if(err.error.message != null)
          this.messageService.showErrorWindow(err.error.message);
        else
          this.messageService.showErrorWindow('File too large');
      }
    );

    this.selectedFiles = undefined;
  }


  toggleHover(event: boolean) {
    this.isHovering = event;
    console.log(this.isHovering);
  }

  onDrop(files: FileList) {
    this.selectedFiles = files;
  }
}
