import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialog } from "@angular/material/dialog";
import { ImageSelectComponent } from "../../image-select/image-select.component";
import { SizeDialogComponent } from "../../size-dialog/size-dialog.component";
import { AuthService } from "../../auth.service";
import { ApiService } from "../../api/api";
import { Collage } from '../../collage/collage.service'
import { Setting } from "../../collage/setting";
import ImageBox from "../../collage/image-box"
import { toDataURL } from '../../collage/util';
import { createWall, saveWall } from "../template.builder";
import { environment } from 'src/environments/environment';
import { ImageService, WallImageService } from 'src/app/collage/image.service';
import { PriceDialogComponent } from 'src/app/price-dialog/price-dialog.component';
import { WallSettingComponent } from 'src/app/wall-setting-dialog/wall-setting.component';

@Component({
  selector: "wall-maker",
  templateUrl: "wall-maker.component.html",
  styleUrls: ["wall-maker.component.scss"],
})
export class WallMakerComponent implements OnInit {
  public loading: boolean = false;
  public isMobile: any;
  public imageSvc: ImageService

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService,
    private authSvc: AuthService,
    private router: Router,
    private api: ApiService,
    private collage: Collage,
    public setting: Setting
  ) {}

  async ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    console.log("IsMobile", this.isMobile)

    this.imageSvc = new ImageService(this.api)
    this.collage.onLoadingStateChanged = (state) => (this.loading = state);
    this.collage.onMenuItemClicked = (e) => this.onMenuItemClicked(e)

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }

    this.loading = true
    await this.imageSvc.updateImages()

    this.setting.unitOfLength = "inch"
    this.setting.width = 8
    this.setting.height = 8
    this.create();

    this.loading = false
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  async onMenuItemClicked(e) {
    switch (e.target['id']) {
      case 'add_frame':
        this.collage.addWallFrame()
        break

      case 'change_size':
        this.openChangeSizeDialog();
        break

      case 'frame_price':
        this.openPriceDialog()
        break

      case 'delete_frame':
        this.collage.deleteCell()
        break

      case 'add_background':
        this.setBackgroundImage()
        break
    }
  }

  openChangeSizeDialog() {
    const size = this.collage.getSelectedImageBoxSize()
    const dialogRef = this.dialog.open(SizeDialogComponent, {
      data: size,
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.collage.changeCellSize(data)
      }
    })
  }

  openPriceDialog() {
    let price = 0;
    const box: ImageBox = this.collage.getSelectedImage()
    if (box) {
      price = Math.max(0, box.price)
    }

    const dialogRef = this.dialog.open(PriceDialogComponent, {
      data: {
        title: "Price",
        price: price
      },
    });
    dialogRef.afterClosed().subscribe((price) => {
      if (price) {
        console.log("Price", price)
        this.collage.setFramePrice(price)
      }
    })
  }

  async setBackgroundImage() {
    let images = this.imageSvc.thumbImages
    if (this.setting.mode == 'wall') {
      this.loading = true
      images = await this.imageSvc.updateImages()
      this.loading = false
    }

    const dialogRef = this.dialog.open(ImageSelectComponent, {
      data: { images: images},
      width: (this.isMobile) ? "90%" : "50%"
    });
    dialogRef.afterClosed().subscribe(async (url) => {
      if (url) {
        await this.collage.setBackgroundImage(url)
      }
    })
  }
  
  async onControlActionEvent(e) {
    if (e.action == "create_wall_frames") {
      await this.create();
    }
  }

  private async create() {
    this.collage.setSetting(this.setting.clone())
    await createWall(this.collage);
  }

  async onSaveWallButtonClick() {
    const dialogRef = this.dialog.open(WallSettingComponent, {
      data: {
        discount: 40
      },
      width: (this.isMobile) ? "90%" : "20%"
    });
    dialogRef.afterClosed().subscribe(async (options) => {
      if (options) {
        console.log('options', options)
        if (await saveWall(this.collage, options)) {
          this.toastr.success("Success");
        }
        else {
          this.toastr.success("Failed to save wall");  
        }
      }
    })
  }

  onShowWallsButtonClick() {
    this.router.navigate(["/admin/walls"]);
  }

  handleDrop(e) {
    this.collage.onHandleDrop(e.offsetX, e.offsetY)
    return false;
  }
}
