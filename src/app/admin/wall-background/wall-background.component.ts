import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../../auth.service";
import { ApiService } from "../../api/api";
import { Setting } from "../../collage/setting";
import { toDataURL } from '../../collage/util';
import { environment } from 'src/environments/environment';
import { ImageService, WallImageService } from 'src/app/collage/image.service';

@Component({
  selector: "wall-background",
  templateUrl: "wall-background.component.html",
  styleUrls: ["wall-background.component.scss"],
})
export class WallBackgroundComponent implements OnInit {
  public loading: boolean = false;
  public isMobile: any;
  public imageSvc: ImageService

  constructor(
    private toastr: ToastrService,
    private deviceService: DeviceDetectorService,
    private authSvc: AuthService,
    private router: Router,
    private api: ApiService,
  ) {}

  async ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    console.log("IsMobile", this.isMobile)

    this.imageSvc = new WallImageService(this.api)

    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }

    console.log("updateImages-000")
    this.loading = true
    await this.imageSvc.updateImages()
    this.loading = false
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  async deleteImage(image) {
    let result = await this.api.deleteImage(image.url);
    if (result) {
      const index = this.imageSvc.thumbImages.indexOf(image);
      if (index > -1) {
        this.imageSvc.thumbImages.splice(index, 1);
      }
    }
  }
}
