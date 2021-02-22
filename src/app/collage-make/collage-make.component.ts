import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "../auth.service";
import { ImageEditorComponent } from "../image-editor/image-editor.component";
import { ImageCropperComponent } from "../image-editor/image-cropper.component";
import { Collage } from '../collage/collage'

@Component({
  selector: "collage-make",
  templateUrl: "collage-make.component.html",
  styleUrls: ["collage-make.component.scss"],
})
export class CollageMakeComponent implements OnInit {
  public loading: boolean = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private authSvc: AuthService,
    private router: Router,
    private collage: Collage
  ) {}

  async ngOnInit() {
    this.collage.onLoadingStateChanged = (state) => (this.loading = state);
    this.collage.openImageEditor = (url) => this.openImageEditor(url);
    this.collage.openImageCropper = (url, width, height) => this.openImageCropper(url, width, height);

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  openImageEditor(imageUrl) {
    this.dialog.open(ImageEditorComponent, {
      data: {
        imageUrl: imageUrl
      },
    });
  }

  openImageCropper(imageUrl, boardWidth, boardHeight) {
    this.dialog.open(ImageCropperComponent, {
      data: {
        imageBase64: imageUrl,
        ratio: boardWidth / boardHeight
      },
    });
  }

  handleDrop(e) {
    console.log(e, e.offsetX, e.offsetY)
    this.collage.onHandleDrop(e.offsetX, e.offsetY)
    return false;
  }

  showCollages() {
    this.router.navigate(["/preview"]);
  }

  async printCollage(way) {
    const userId = this.authSvc.getUserId()
    const url = await this.collage.printCollageImage(userId, way)    
    if (url) {
      const element = document.getElementById('print-button')
      element.setAttribute("href", url)
      element.click()
    }
  }
}

/*
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.setHeight(window.innerHeight);
    canvas.setWidth(window.innerWidth);
    canvas.renderAll();
}
*/
