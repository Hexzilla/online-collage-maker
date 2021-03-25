import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../auth.service";
import { ApiService } from "../api/api";
import { environment } from "./../../environments/environment";
import { toDataURL } from "../collage/util";

@Component({
  selector: "collage-preview",
  templateUrl: "collage-preview.component.html",
  styleUrls: ["collage-preview.component.scss"],
})
export class CollagePreviewComponent implements OnInit {
  public loading: boolean = false;
  images: Array<string> = [];

  constructor(
    private toastr: ToastrService,
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
    console.log("response", response)
    if (response && response["success"]) {
      const data = response["data"];
      const url = environment.apiUrl + "/file/downloadGallary/";
      const images = data.map((it) => {
        return {
          id: it._id,
          src: url + it.image,
          slug: it.slug,
          loaded: false
        };
      });

      images.map(item => {
        toDataURL("GET", item.src)
          .then(src => {
            item.src = src
            this.images.push(item)
          })
      })
    }
    this.loading = false;
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  openDialog(imageUrl) {

  }

  createAutoCollage() {
    this.router.navigate(["/collage/auto"]);
  }

  createTemplateCollage() {
    this.router.navigate(["/collage/select"]);
  }

  createWallDisplay() {
    this.router.navigate(["/collage-walls"]);
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

  async deletePhoto(image) {
    this.loading = true
    const response = await this.api.deleteCollageImage(image['id'])
    console.log(response)
    if (response && response['success']) {
      const index = this.images.findIndex(it => it['id'] == image['id'])
      this.images.splice(index, 1)
      this.toastr.success("Success");
    }
    else {
      this.toastr.error("Failed to delete image");
    }
    this.loading = false
  }
}