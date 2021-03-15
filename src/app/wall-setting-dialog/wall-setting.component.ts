import { Component, OnInit, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface WallSttingData {
  discount: number;
  title: string;
  width: number;
  height: number;
}

@Component({
  selector: "wall-setting",
  templateUrl: "wall-setting.component.html",
  styleUrls: ["wall-setting.component.scss"],
})
export class WallSettingComponent implements OnInit {
  public price: number = 0

  constructor(
    public dialogRef: MatDialogRef<WallSettingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WallSttingData
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
