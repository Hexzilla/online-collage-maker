import { Component, OnInit, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "../api/api";
import { ImageService } from "../collage/image.service";
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
  @Input() imageSvc: ImageService

  constructor(
    private toastr: ToastrService,
    private api: ApiService,
    public  setting: Setting
  ) {}

  ngOnInit() {
    this.progressShow = false
    this.dropZoneStatus = false
  }

  onSelect(event) {
    this.files.push(...event.addedFiles)
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1)
  }

  async uploadFiles() {
    if (this.files.length == 0) {
      this.toastr.error("Please select file")
      return;
    }
    
    this.progressShow = true;
    this.dropZoneStatus = true;
    let formData = new FormData();
    for (var i = 0; i < this.files.length; i++) {
      formData.append("images", this.files[i], this.files[i].name)
    }

    const result = await this.imageSvc.uploadImage(formData)
    if (result) {
      this.toastr.success("success")
      await this.imageSvc.updateImages()
    } 
    else {
      this.toastr.error("failed")
    }

    this.files = []
    this.progressShow = false
    this.dropZoneStatus = false
  }
}
