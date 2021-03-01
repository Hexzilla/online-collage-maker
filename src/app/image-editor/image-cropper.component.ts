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
  showImagePicker = true;
  imagePicketTitle = '';
  imagePickerImageUrl = '';
  imagePickerType = '';
  imageUploading = false;
  cropRatio = 1.0

  constructor(
    public dialogRef: MatDialogRef<ImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageData,
    private collage: Collage
  ) { 
    this.imagePickerImageUrl = this.data.imageBase64
    this.cropRatio = this.data.ratio
  }

  ngOnInit() { }

  onApply(imageUrl) {
    if (imageUrl) {
      this.collage.onImageCropped(imageUrl)
    }
    this.dialogRef.close()
  }

  onClose() {
    this.dialogRef.close()
  }
}
