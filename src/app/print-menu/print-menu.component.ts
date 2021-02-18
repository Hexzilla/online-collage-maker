import { Component, OnInit, Input } from "@angular/core";
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'print-menu',
  templateUrl: 'print-menu.component.html',
})
export class PrintMenu {
  constructor(private _bottomSheetRef: MatBottomSheetRef<PrintMenu>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}