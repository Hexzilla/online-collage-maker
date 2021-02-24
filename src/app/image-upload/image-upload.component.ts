import { Component, OnInit, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "../api/api";
import { Collage } from '../collage/collage'
import { toDataURL } from "../collage/util";
import { Setting } from "../collage/setting";

@Component({
  selector: "image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"],
})
export class ImageUploadComponent implements OnInit {
  files: File[] = [];
  progressShow: boolean;
  dropZoneStatus: boolean;
  images: Array<any> = [];

  constructor(
    private toastr: ToastrService,
    private api: ApiService,
    private collage: Collage,
    private setting: Setting
  ) {}

  ngOnInit() {
    this.progressShow = false;
    this.dropZoneStatus = false;
    this.getImageFromServer();
  }

  async getImageFromServer() {
    const urls = await this.api.getImages();
    this.images = await Promise.all(urls.map(async (url) => {
      const imageBase64 = await toDataURL("GET", url)
      return { url: url, imageBase64: imageBase64}
    }))
    this.setting.thumbImages = this.images
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  async uploadFiles() {
    if (this.files.length == 0) {
      this.toastr.error("Please select file");
      return;
    }
    
    this.progressShow = true;
    this.dropZoneStatus = true;
    let formData = new FormData();
    for (var i = 0; i < this.files.length; i++) {
      formData.append("images", this.files[i], this.files[i].name);
    }

    let result = await this.api.uploadFiles(formData);
    if (result) {
      this.toastr.success("success");
      this.getImageFromServer();
    } else {
      this.toastr.error("failed");
    }

    this.files = [];
    this.progressShow = false;
    this.dropZoneStatus = false;
  }

  async deleteImage(image) {
    let result = await this.api.deleteImage(image.url);
    if (result) {
      const index = this.images.indexOf(image);
      if (index > -1) {
        this.images.splice(index, 1);
      }
    }
  }

  onDragStart(e, url) {
    this.collage.onDragStart(url)
  }
}
