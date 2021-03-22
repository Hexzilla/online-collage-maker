import { Component, OnInit, Input } from "@angular/core";
import { ApiService } from "../api/api";
import { Collage } from '../collage/collage.service'

@Component({
  selector: "image-list",
  templateUrl: "./image-list.component.html",
  styleUrls: ["./image-list.component.scss"],
})
export class ImageListComponent implements OnInit {
  loading: boolean = false
  @Input() title: string
  @Input() images: Array<object>
  
  constructor(
    private api: ApiService,
    private collage: Collage
  ) {}

  async ngOnInit() { }

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
