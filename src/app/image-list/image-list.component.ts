import { Component, OnInit, Input } from "@angular/core";
import { ApiService } from "../api/api";
import { Collage } from '../collage/collage.service'
import { Setting } from "../collage/setting";

@Component({
  selector: "image-list",
  templateUrl: "./image-list.component.html",
  styleUrls: ["./image-list.component.scss"],
})
export class ImageListComponent implements OnInit {
  loading: boolean = false
  
  constructor(
    private api: ApiService,
    private collage: Collage,
    public  setting: Setting
  ) {}

  async ngOnInit() {
    this.loading = true
    await this.setting.updateUserImages(this.api);
    this.loading = false
  }

  async deleteImage(image) {
    let result = await this.api.deleteImage(image.url);
    if (result) {
      const index = this.setting.thumbImages.indexOf(image);
      if (index > -1) {
        this.setting.thumbImages.splice(index, 1);
      }
    }
  }

  onDragStart(e, url) {
    this.collage.onDragStart(url)
  }
}
