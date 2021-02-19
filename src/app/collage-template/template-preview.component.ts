import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../auth.service";
import { ApiService } from "../api/api";
import { environment } from "./../../environments/environment";
import { loadImage } from "../collage/util";

@Component({
  selector: "template-preview",
  templateUrl: "template-preview.component.html",
  styleUrls: ["template-preview.component.scss"],
})
export class TemplatePreviewComponent implements OnInit {
  public loading: boolean = false;
  images: Array<object> = [];

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
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
    const data = await this.api.getTemplateList();
    console.log(data)
    if (data) {
      const url = environment.apiUrl + "/collage/templates/image/";
      const images = data.map((it) => {
        return {
          id: it._id,
          src: url + it.image,
          loaded: false
        };
      });
      console.log(images)

      const count = Math.min(4, images.length)
      const preloadImages = images.slice(0, count);
      await Promise.all(
        preloadImages.map(async (item) => {
          return await loadImage(item.src);
        })
      );

      this.images = images
    }
    this.loading = false;
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  createTemplate() {
    this.router.navigate(["/template"]);
  }

  editTemplate(image){

  }

  async deletePhoto(image) {
    this.loading = true
    const result = await this.api.deleteTemplate(image['id'])
    if (result) {
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