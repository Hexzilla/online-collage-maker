import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { NeworderService } from 'src/app/services/neworder.service';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {

  imageChangedEvent: any = '';
  imageEvent: ImageCroppedEvent;
  changedImage: any;
  ratioHeight: any;
  ratioWidth: any;
  maintainAspectRatio: any;
  loaded = false;
  @ViewChild(ImageCropperComponent, { static: false }) imageCropper: ImageCropperComponent;
  constructor(
    private sharedSvc: SharedService,
    private nos: NeworderService,
    private router: Router,
    public dialogRef: MatDialogRef<CanvasComponent>
  ) {

    if (this.sharedSvc.img) {
      this.imageChangedEvent = this.sharedSvc.img.src;
      this.ratioHeight = this.sharedSvc.ratioHeight;
      this.ratioWidth = this.sharedSvc.ratioWidth;
      this.maintainAspectRatio = this.sharedSvc.maintainAspectRatio;
    }
  }

  save() {
    this.nos.File_edited = new File([this.imageEvent.file], 'orderImage_edited.png');
    // console.log(this.nos.File_edited);
    this.dialogRef.close(this.changedImage);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  crop() {
    this.imageCropper.crop();
  }

  imageCropped(event: ImageCroppedEvent) {
    // console.log(event);
    this.imageEvent = event;
    this.changedImage = event.base64;
    // const crpFile = new File()
    this.nos.File_edited = new File([event.file], 'orderImage_edited.png');
    // console.log(this.nos.File_edited);
    this.sharedSvc.cropHeight = event.height;
    this.sharedSvc.cropWidth = event.width;
  }

  imageLoaded() {
    this.loaded = true;
    // console.log('image cropper loaded');
  }

  loadImageFailed() {
    // console.log('failed to load image ');
  }

  rotateRight() {
    this.imageCropper.rotateRight();
  }

  rotateLeft() {
    this.imageCropper.rotateLeft();
  }

  zoomIn() {
    const t: any = document.getElementsByClassName('source-image');
    if (t.length > 0) {
      t[0].height = t[0].height + 10;
      t[0].width = t[0].width + 10;
    }
  }

  zoomOut() {
    const t: any = document.getElementsByClassName('source-image');
    if (t.length > 0) {

      t[0].height = t[0].height - 10;
      t[0].width = t[0].width - 10;
    }
  }
}
