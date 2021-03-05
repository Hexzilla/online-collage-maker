import { Component, OnInit, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { loadImage, toDataURL } from "../collage/util";

export interface SizeDialogData {
  width: number;
  height: number;
}

@Component({
  selector: "size-dialog",
  templateUrl: "size-dialog.component.html",
  styleUrls: ["size-dialog.component.scss"],
})
export class SizeDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SizeDialogData
  ) { }

  async ngOnInit() {
    
  }

  onApply() {
    this.dialogRef.close(this.data)
  }

  onClose() {
    this.dialogRef.close();
  }
}
