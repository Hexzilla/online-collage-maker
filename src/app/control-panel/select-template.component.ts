import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../api/api";
import { environment } from "./../../environments/environment";
import { loadImage } from "../collage/util";
import { Collage } from "../collage/collage";

@Component({
  selector: "select-template",
  templateUrl: "select-template.component.html",
  styleUrls: ["select-template.component.scss"],
})
export class SelectTemplateComponent implements OnInit {
  public loading: boolean = false;
  images: Array<object> = [];

  constructor(
    public dialogRef: MatDialogRef<SelectTemplateComponent>,
    private api: ApiService,
    private collage: Collage
  ) { }

  async ngOnInit() {
    this.loading = true;
    const data = await this.api.getTemplateList();
    if (data) {
      const url = environment.apiUrl + "/collage/templates/image/";
      const images = data.map((it) => {
        return {
          id: it._id,
          src: url + it.image,
          loaded: false
        };
      });

      const count = Math.min(4, images.length)
      const preloadImages = images.slice(0, count);
      await Promise.all(
        preloadImages.map(async (item) => {
          return await loadImage(item.src);
        })
      );

      this.images = images
    }
    this.loading = false;
  }

  async onSelectTemplate(image) {
    await this.collage.createCollageByTemplateId(image.id)
    this.onClose()
  }

  onClose() {
    this.dialogRef.close();
  }
}
