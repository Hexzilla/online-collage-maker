import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../auth.service";
import { ApiService } from "../../api/api";
import { environment } from "../../../environments/environment";
import { Setting } from "../../collage/setting";
import { toDataURL } from "../../collage/util";

@Component({
  selector: "wall-preview",
  templateUrl: "wall-preview.component.html",
  styleUrls: ["wall-preview.component.scss"],
})
export class WallPreviewComponent implements OnInit {
  public loading: boolean = false;
  public previewLoading: boolean = false;
  images: Array<object> = [];

  constructor(
    private toastr: ToastrService,
    private api: ApiService,
    private authSvc: AuthService,
    private router: Router,
    private setting: Setting
  ) {}

  async ngOnInit() {
    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }

    this.loading = true;
    const data = await this.api.getWallList();
    if (data) {
      const url = environment.apiUrl + "/collage/wallframes/image/";
      const images = data.map((it) => {
        const totalPrice = it.images.reduce((accumulator, img) => {
          return (accumulator + img.price)
        }, 0)
        const finalPrice = totalPrice * (100 - it.options.discount) / 100
        return {
          id: it._id,
          data: it,
          options: it.options,
          src: url + it.image,
          totalPrice: totalPrice,
          finalPrice: finalPrice,
          loaded: false
        };
      });
      console.log('Wall Frames: ', images)

      images.map(item => {
        toDataURL("GET", item.src)
          .then(src => {
            item.src = src
            this.images.push(item)
            if (this.images.length == images.length) {
              this.previewLoading = false
            }
            else {
              this.previewLoading = true
            }
          })
      })
    }
    this.loading = false;
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  editTemplate(image){

  }

  async onDeleteWall(image) {
    this.loading = true
    const result = await this.api.deleteWallFrame(image['id'])
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