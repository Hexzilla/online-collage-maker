import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "../auth.service";
import { ImageEditorComponent } from "../image-editor/image-editor.component";
import { Collage } from '../collage/collage'

@Component({
  selector: "collage-make",
  templateUrl: "collage-make.component.html",
  styleUrls: ["collage-make.component.scss"],
})
export class CollageMakeComponent implements OnInit {
  public selectedImageUrl: string = null;
  public loading: boolean = false;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private authSvc: AuthService,
    private router: Router,
    private collage: Collage
  ) {}

  async ngOnInit() {
    this.collage.onSelectedImageUrl = (url) => (this.selectedImageUrl = url);
    this.collage.onLoadingStateChanged = (state) => (this.loading = state);
    this.collage.openDialog = (url) => this.openDialog(url);

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  openDialog(imageUrl) {
    this.dialog.open(ImageEditorComponent, {
      data: {
        imageUrl: imageUrl,
      },
    });
  }
}
