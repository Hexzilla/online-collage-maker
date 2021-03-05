import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { ImageSelectComponent } from "../../image-select/image-select.component";
import { SizeDialogComponent } from "../../size-dialog/size-dialog.component";
import { AuthService } from "../../auth.service";
import { Collage } from '../../collage/collage'
import { Setting } from "../../collage/setting";

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
    private collage: Collage,
    private setting: Setting
  ) {}

  async ngOnInit() {
    this.collage.onLoadingStateChanged = (state) => (this.loading = state);
    this.collage.onMenuItemClicked = (e) => this.onMenuItemClicked(e)

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }

    this.setting.unitOfLength = "feet"
    this.setting.canvasWidth = 10
    this.setting.canvasHeight = 10
    this.collage.createWallFrames();
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  async onMenuItemClicked(e) {
    switch (e.target['id']) {
      case 'add_frame':
        this.collage.addWallFrame()
        break
      case 'add_background':
        this.setBackgroundImage()
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

  setBackgroundImage() {
    const dialogRef = this.dialog.open(ImageSelectComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(async (url) => {
      if (url) {
        await this.collage.setBackgroundImage(url)
      }
    })
  }
  
  async onControlActionEvent(e) {
    if (e.action == "create_wall_frames") {
      await this.collage.createWallFrames();
    }
  }

  async saveWallFrames() {
    if (this.setting.savedWallFrames) {
      const saved = await this.collage.saveWallFrames(this.setting.savedWallFrames._id);
      if (saved) {
        this.toastr.success("Success");
        return
      }
    }
    else {
      this.setting.savedWallFrames = await this.collage.saveWallFrames(0);
      if (this.setting.savedWallFrames) {
        this.toastr.success("Success");  
        return
      }
    }

    this.toastr.success("Failed to save template");  
  }

  showWallFrames() {
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
