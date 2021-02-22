import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "../auth.service";
import { ImageEditorComponent } from "../image-editor/image-editor.component";
import { Collage } from '../collage/collage'

@Component({
  selector: "collage-template",
  templateUrl: "collage-template.component.html",
  styleUrls: ["collage-template.component.scss"],
})
export class CollageTemplateComponent implements OnInit {
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
    //this.collage.openImageEditor = (url, ratio) => this.openImageEditor(url);//TODO

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }

    this.collage.createTemplate({
      widthInch: 16,
      heightInch: 12,
      landscape: false,
      borderWidth: 0,
      borderColor: "rgb(0,0,0)"
    });
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  showTemplates() {
    this.router.navigate(["/template/preview"]);
  }

  openImageEditor(imageUrl) {
    console.log("OpenDialog", this.dialog)
    this.dialog.open(ImageEditorComponent, {
      data: {
        imageUrl: imageUrl,
      },
    });
  }

  handleDrop(e) {
    console.log(e, e.offsetX, e.offsetY)
    this.collage.onHandleDrop(e.offsetX, e.offsetY)
    return false;
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
