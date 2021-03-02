import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../api/api";
import { ToastrService } from "ngx-toastr";
import { Collage } from "../collage/collage";
import { Setting } from "../collage/setting";
import { b64toBlob } from "../collage/util";

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
  loading = false;
  showImagePicker = true;
  imagePicketTitle = '';
  imagePickerImageUrl = '';
  imagePickerType = '';
  imageUploading = false;
  cropRatio = 1.0

  constructor(
    public dialogRef: MatDialogRef<ImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageData,
    private toastr: ToastrService,
    private api: ApiService,
    private collage: Collage,
    public  setting: Setting
  ) { 
    this.imagePickerImageUrl = this.data.imageBase64
    this.cropRatio = this.data.ratio
  }

  ngOnInit() { }

  async onApply(data) {
    if (data.action == "close") {
      this.dialogRef.close()
      return
    }

    if (data.action == "upload") {
      await this.uploadImage(data.image)

    }
    else if (data.action == "change") {
      data.image && this.collage.onImageCropped(data.image)
      this.dialogRef.close()
    }
  }

  async uploadImage(image) {
    this.loading = true
    const blob = b64toBlob(image, "image/jpeg")

    let formData = new FormData();
    formData.append("images", blob, "image_editor_upload.jpg")

    let result = await this.api.uploadFiles(formData)
    if (result) {
      this.toastr.success("success")
      await this.setting.updateUserImages(this.api)
    } 
    else {
      this.toastr.error("failed")
    }
    this.loading = false
  }

  onClose() {
    this.dialogRef.close()
  }
}
