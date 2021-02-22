import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import ImageBox from "../collage/image-box";

export interface DialogData {
  imageBox: ImageBox;
}

@Component({
  selector: "image-editor",
  templateUrl: "image-editor.component.html",
  styleUrls: ["image-editor.component.scss"],
})
export class ImageEditorComponent implements OnInit {
  scale: number = 1.0;

  constructor(
    public dialogRef: MatDialogRef<ImageEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {}

  onImageSizeChanged(e) {
    const el = document.getElementById("image-size-value");
    el.innerHTML = e.value + "%";
    this.data.imageBox.setZoomScale(e.value / 100)
  }

  onBrightnessChanged(e) {
    const el = document.getElementById("image-brightness-value");
    el.innerHTML = e.value;
    this.data.imageBox.setBrightness(e.value / 100)
  }

  onClose() {
    this.dialogRef.close();
  }
}
