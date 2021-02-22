import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { fabric } from "fabric";
import { Collage } from "../collage/collage";

export interface ImageData {
  imageBase64: string;
  ratio: number;
}

@Component({
  selector: "image-cropper-wrapper",
  templateUrl: "image-cropper.component.html",
  styleUrls: ["image-editor.component.scss"],
})
export class ImageCropperComponent implements OnInit {
  selectionRect: fabric.Rect;
  startPoint: fabric.Point;
  croppedImage: any = '';

  constructor(
    public dialogRef: MatDialogRef<ImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageData,
    private collage: Collage
  ) { }

  ngOnInit() { }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    console.log("cropperReady")
  }

  loadImageFailed() {
    console.log("loadImageFailed")
  }

  onApply() {
    this.collage.onImageCropped(this.croppedImage)
    this.dialogRef.close()
  }

  onClose() {
    this.dialogRef.close()
  }
}
