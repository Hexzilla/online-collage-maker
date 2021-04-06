import { Component, OnInit, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "../api/api";
import { ImageService } from "../collage/image.service";
import { Setting } from "../collage/setting";
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: "image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"],
})
export class ImageUploadComponent implements OnInit {
  files: File[] = [];
  uploadProgress = -1;
  uploadButtonName = "Upload"
  @Input() imageSvc: ImageService

  constructor(
    private toastr: ToastrService,
    public  setting: Setting
  ) {}

  ngOnInit() {}

  onSelect(event) {
    this.files.push(...event.addedFiles)
    if (this.files.length > 5) {
      this.files = this.files.slice(0, 5)
    }
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1)
  }

  async uploadFiles() {
    if (this.files.length == 0) {
      this.toastr.error("Please select file")
      return;
    }

    this.uploadProgress = 0;
    this.uploadButtonName = `Image uploading : ${this.uploadProgress} % `;

    let formData = new FormData();
    for (var i = 0; i < this.files.length; i++) {
      formData.append("images", this.files[i], this.files[i].name)
    }

    this.imageSvc.uploadCollageImages(formData).subscribe((event: any) => {
      console.log("event.type: ", event.type);
      if (event.type === HttpEventType.UploadProgress) {
        const uploadProgress = Math.round((event.loaded / event.total * 100));
        this.uploadProgress = uploadProgress;
        this.uploadButtonName = `Image uploading : ${uploadProgress} % `;
      } 
      else if (event.type === HttpEventType.Response) {
        this.files = []
        this.reset()
        this.toastr.success("success")
        await this.imageSvc.updateImages()
      }
    }, err => {
      console.log(err.message);
      this.reset()
      this.toastr.error("Failed to upload images")
    });
  }

  reset() {
    this.uploadProgress = -1;
    this.uploadButtonName = "Upload";
  }
}
