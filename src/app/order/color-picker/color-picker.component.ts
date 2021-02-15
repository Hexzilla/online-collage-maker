import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  color='#ff0000ff';
  constructor( public dialogRef: MatDialogRef<ColorPickerComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  colorChange(color:string){
    this.color=color;
  }

  cancel(){
    this.dialogRef.close(this.color);
  }

  close(){
    this.dialogRef.close(this.color);
  }

}
