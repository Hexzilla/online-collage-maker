import { Injectable, Component } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {

  }

  showSnackbar(message: string, actionButton?: any, duration?: number) {
    const snackBarRef = this.snackBar.open(message, actionButton || 'Ok', {
      duration: duration || 3000,
      verticalPosition: 'top'
    });
  }

  showConfirmDialog(msg: string, title: string) {
    //    const dialogRef=this.dialog.open(ConfirmDialogModal);
  }
}

