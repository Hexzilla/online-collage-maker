import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../auth.service";
import { ApiService } from "../api/api";
import { environment } from "./../../environments/environment";

@Component({
  selector: "collage-preview",
  templateUrl: "collage-preview.component.html",
  styleUrls: ["collage-preview.component.scss"],
})
export class CollagePreviewComponent implements OnInit {
  public loading: boolean = false;
  images: Array<string> = [];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private api: ApiService,
    private authSvc: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }

    this.loading = true;
    const userId = this.authSvc.getUserId();
    const response = await this.api.getCollageImages(userId);
    console.log(response);
    if (response && response["success"]) {
      const data = response["data"];
      const url = environment.apiUrl + "/file/downloadGallary/";
      this.images = data.map((it) => {
        return {
          src: url + it.image,
          slug: it.slug,
        };
      });
      console.log(this.images);
    }
    this.loading = false;
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  openDialog(imageUrl) {
    // this.dialog.open(ImageEditorComponent, {
    //   data: {
    //     imageUrl: imageUrl,
    //   },
    // });
  }

  linkCollageMaker() {
    this.router.navigate(["/collage"]);
  }

  printPhoto(image, way) {
    const userId = this.authSvc.getUserId();

    let url = environment.apiUrl;
    if (way == 0) {
      url += "/canvas-prints/order/gallary/";
    } else if (way == 1) {
      url += "/poster-prints/order/gallary/";
    } else {
      url += "/photo-prints/order/gallary/";
    }
    url += image.slug;

    window.open(url, "_blank");
  }
}