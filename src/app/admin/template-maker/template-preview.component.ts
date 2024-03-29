import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../auth.service";
import { ApiService } from "../../api/api";
import { environment } from "../../../environments/environment";
import { toDataURL } from "../../collage/util";

@Component({
  selector: "template-preview",
  templateUrl: "template-preview.component.html",
  styleUrls: ["template-preview.component.scss"],
})
export class TemplatePreviewComponent implements OnInit {
  public loading: boolean = false;
  public previewLoading: boolean = false;
  images: Array<object> = [];

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
    const data = await this.api.getTemplateList();
    if (data) {
      const url = environment.apiUrl + "/collage/templates/image/";
      const images = data.map((it) => {
        return {
          id: it._id,
          src: url + it.image,
          loaded: false
        };
      });

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

  onCreateButtonClick() {
    this.router.navigate(["/admin/template"]);
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