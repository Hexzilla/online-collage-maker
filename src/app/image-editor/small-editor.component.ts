import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { fabric } from "fabric";
import { Collage } from "../collage/collage";

export interface DialogData {
  imageUrl: string;
}

@Component({
  selector: "small-editor",
  templateUrl: "small-editor.component.html",
  styleUrls: ["image-editor.component.scss"],
})
export class SmallEditorComponent implements OnInit {
  scale: number = 1.0;
  brightness: number = 0.1;

  constructor(
    public dialogRef: MatDialogRef<SmallEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private collage: Collage
  ) { }

  ngOnInit() {}

  onImageZoomChanged(e) {
    const el = document.getElementById("image-zoom-value");
    el.innerHTML = e.value + "%";
    this.scale = e.value / 100;
  }

  onBrightnessChanged(e) {
    const el = document.getElementById("image-brightness-value");
    el.innerHTML = e.value;
    this.brightness = e.value / 100;
  }

  onApply() {
    this.dialogRef.close()
  }

  onClose() {
    this.dialogRef.close();
  }
}
