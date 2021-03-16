import { Component, OnInit, Inject } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UploadFileService } from '../../../_services/upload-file.service';
import { UserService } from '../../../_services/user.service';
import { ImageData } from '../../model/file-data';
import { MessageService } from '../../../_services/error-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThemeService } from '../../../_services/theme.service';

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
  loading = false;
  fileInfos: Observable<Array<ImageData>>;
  downloadUri: Observable<string>;
  imageData:   Array<ImageData>;
  imgLink: Observable<string>;
  isHovering: boolean;
  files: File[] = [];
  profileId;
  fileSelected=false;
  theme='';
  fileToLargeError=false;
  rejectedFiles: File[] = [];
  constructor(
    private themeService: ThemeService,
    private uploadService: UploadFileService,
    private userProfileService: UserService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<UploadProfilePictureComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.profileId = data.profileId;

    }


  onSelect(event) {
    this.files.splice(0)
    this.files.push(...event.addedFiles);
    this.fileSelected = true;

    this.rejectedFiles.splice(0);
    this.rejectedFiles = event.rejectedFiles
    if (this.rejectedFiles.length > 0)
    {
      this.fileToLargeError = true;
      this.fileSelected = false;
    }
    else
    {
      this.fileToLargeError=false;
    }
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.fileSelected = false;
  }
  ngOnInit(): void {
    this.theme = this.themeService.getTheme()
    this.themeService.themeChanged$.subscribe(data=>this.theme=data)
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress = 0;

    this.currentFile = this.files[0];
    this.loading = true;
    this.userProfileService.uploadProfilePicture(this.currentFile, this.profileId).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.imageData = event.body;
          this.downloadUri = of(this.imageData[0].fileDownloadUri).pipe();
          this.loading = false;
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

  getDropzoneStyle(){
    if (this.theme ==='Dark'){
      return {
        "background" : "gray",
        "border": "2px dashed #FFFFFF"
      }
  }
  }
}
