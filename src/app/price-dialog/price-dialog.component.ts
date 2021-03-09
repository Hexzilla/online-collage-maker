import { Component, OnInit, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { loadImage, toDataURL } from "../collage/util";

export interface PriceDialogData {
  title: string;
  price: number;
}

@Component({
  selector: "price-dialog",
  templateUrl: "price-dialog.component.html",
  styleUrls: ["price-dialog.component.scss"],
})
export class PriceDialogComponent implements OnInit {
  public price: number = 0

  constructor(
    public dialogRef: MatDialogRef<PriceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PriceDialogData
  ) { }

  async ngOnInit() {
    
  }

  onApply() {
    this.dialogRef.close(this.data.price)
  }

  onClose() {
    this.dialogRef.close();
  }
}
