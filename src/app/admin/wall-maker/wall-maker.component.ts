import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { ImageSelectComponent } from "../../image-select/image-select.component";
import { SizeDialogComponent } from "../../size-dialog/size-dialog.component";
import { AuthService } from "../../auth.service";
import { ApiService } from "../../api/api";
import { Collage } from '../../collage/collage.service'
import { Setting } from "../../collage/setting";
import { toDataURL } from '../../collage/util';
import { createWall, saveWall } from "../template.builder";
import { environment } from 'src/environments/environment';
import { ImageService, WallImageService } from 'src/app/collage/image.service';
import { PriceDialogComponent } from 'src/app/price-dialog/price-dialog.component';

@Component({
  selector: "wall-maker",
  templateUrl: "wall-maker.component.html",
  styleUrls: ["wall-maker.component.scss"],
})
export class WallMakerComponent implements OnInit {
  public loading: boolean = false;
  public imageSvc: ImageService

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private authSvc: AuthService,
    private router: Router,
    private api: ApiService,
    private collage: Collage,
    public setting: Setting
  ) {}

  async ngOnInit() {
    this.imageSvc = new WallImageService(this.api)
    this.collage.onLoadingStateChanged = (state) => (this.loading = state);
    this.collage.onMenuItemClicked = (e) => this.onMenuItemClicked(e)

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }

    this.loading = true
    await this.imageSvc.updateImages()

    this.setting.unitOfLength = "feet"
    this.setting.width = 10
    this.setting.height = 10
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
    const dialogRef = this.dialog.open(PriceDialogComponent, {
      data: {
        title: "Price",
        price: 0
      },
    });
    dialogRef.afterClosed().subscribe((price) => {
      if (price) {
        console.log("Price", price)
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
    const dialogRef = this.dialog.open(PriceDialogComponent, {
      data: {
        title: "Discount",
        price: 0
      },
    });
    dialogRef.afterClosed().subscribe(async (discount: number) => {
      if (discount) {
        if (await saveWall(this.collage, discount)) {
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
