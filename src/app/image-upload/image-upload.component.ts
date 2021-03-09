import { Component, OnInit, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "../api/api";
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
  @Input() uploadMode: string = "user"

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

    let result = false
    if (this.uploadMode == "user") {
      result = await this.api.uploadFiles(formData)
      if (result) {
        this.toastr.success("success")
        await this.setting.updateUserImages(this.api)
      } 
      else {
        this.toastr.error("failed")
      }
    }
    else {
      result = await this.api.uploadWallImage(formData)
      if (result) {
        this.toastr.success("success")
        await this.setting.updateWallImages(this.api)
      } 
      else {
        this.toastr.error("failed")
      }
    }

    this.files = []
    this.progressShow = false
    this.dropZoneStatus = false
  }
}
