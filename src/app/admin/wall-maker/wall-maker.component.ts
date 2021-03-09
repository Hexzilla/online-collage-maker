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

@Component({
  selector: "wall-maker",
  templateUrl: "wall-maker.component.html",
  styleUrls: ["wall-maker.component.scss"],
})
export class WallMakerComponent implements OnInit {
  public loading: boolean = false;

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
    this.collage.onLoadingStateChanged = (state) => (this.loading = state);
    this.collage.onMenuItemClicked = (e) => this.onMenuItemClicked(e)

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }

    this.loading = true
    await this.setting.updateWallImages(this.api)

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

  async uploadImage(formData) {
    return await this.api.uploadWallImage(formData)
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
    if (await saveWall(this.collage)) {
      this.toastr.success("Success");
    }
    else {
      this.toastr.success("Failed to save wall");  
    }
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
