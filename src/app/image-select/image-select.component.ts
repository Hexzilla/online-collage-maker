import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Setting } from "../collage/setting";

export interface ImageSelectData {
  images: Array<any>;
}

@Component({
  selector: "image-select",
  templateUrl: "image-select.component.html",
  styleUrls: ["image-select.component.scss"],
})
export class ImageSelectComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ImageSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageSelectData
  ) { }

  async ngOnInit() { }

  async onSelectImage(image) {
    this.dialogRef.close(image.url)
  }

  onClose() {
    this.dialogRef.close();
  }
}
