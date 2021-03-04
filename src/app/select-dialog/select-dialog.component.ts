import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { loadImage, toDataURL } from "../collage/util";

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
    @Inject(MAT_DIALOG_DATA) public data: SelectDialogData
  ) { }

  async ngOnInit() {
    const images = this.data.images
    images.forEach(async (item) => {
      item.src = await toDataURL("GET", item.src)
      this.images.push(item)
    })
  }

  onItemSelected(image) {
    this.dialogRef.close(image.id)
  }

  onClose() {
    this.dialogRef.close();
  }
}
