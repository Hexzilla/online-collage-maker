import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Collage } from "../collage/collage";
import { Setting } from "../collage/setting";

@Component({
  selector: "image-select",
  templateUrl: "image-select.component.html",
  styleUrls: ["image-select.component.scss"],
})
export class ImageSelectComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ImageSelectComponent>,
    private collage: Collage,
    public setting: Setting
  ) { }

  async ngOnInit() { }

  async onSelectImage(image) {
    this.dialogRef.close(image.url)
  }

  onClose() {
    this.dialogRef.close();
  }
}
