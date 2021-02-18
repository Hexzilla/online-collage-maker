import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "../api/api";
import { Collage } from '../collage/collage'

@Component({
  selector: "image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"],
})
export class ImageUploadComponent implements OnInit {
  files: File[] = [];
  progressShow: boolean;
  dropZoneStatus: boolean;
  images: string[] = [];

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private api: ApiService,
    private collage: Collage
  ) {}

  ngOnInit() {
    this.progressShow = false;
    this.dropZoneStatus = false;
    this.getImageFromServer();
  }

  async getImageFromServer() {
    this.images = await this.api.getImages();
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
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
    let result = await this.api.deleteImage(image);
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
