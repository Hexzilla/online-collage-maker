import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../api/api";
import { environment } from "../../environments/environment";
import { loadImage } from "../collage/util";

export interface SelectDialogData {
  title: string;
  images: Array<any>;
}

@Component({
  selector: "select-dialog",
  templateUrl: "select-dialog.component.html",
  styleUrls: ["select-dialog.component.scss"],
})
export class SelectDialogComponent implements OnInit {
  public loading: boolean = false;
  images: Array<object> = [];

  constructor(
    public dialogRef: MatDialogRef<SelectDialogComponent>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: SelectDialogData
  ) { }

  async ngOnInit() {
    const images = this.data.images
    const count = Math.min(4, images.length)
    const preloadImages = images.slice(0, count);
    await Promise.all(
      preloadImages.map(async (item) => {
        return await loadImage(item.src);
      })
    );
    
    this.images = images
  }

  onItemSelected(image) {
    this.dialogRef.close(image.id)
  }

  onClose() {
    this.dialogRef.close();
  }
}
