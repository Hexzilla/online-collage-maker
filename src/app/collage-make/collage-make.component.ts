import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from "../auth.service";
import { ImageEditorComponent } from "../image-editor/image-editor.component";
import { ImageCropperComponent } from "../image-editor/image-cropper.component";
import { ImageSelectComponent } from "../image-select/image-select.component";
import { SelectDialogComponent } from "../select-dialog/select-dialog.component";
import { environment } from "../../environments/environment";
import { ApiService } from "../api/api";
import { Collage } from '../collage/collage.service'
import ImageBox from "../collage/image-box"
import { Setting } from '../collage/setting';
import { ImageService, WallImageService } from '../collage/image.service';
import { 
  createAutoCollage, 
  createCollageByTemplateId, 
  createCollageByWallId 
} from '../collage/collage.maker'


@Component({
  selector: "collage-make",
  templateUrl: "collage-make.component.html",
  styleUrls: ["collage-make.component.scss"],
})
export class CollageMakeComponent implements OnInit {
  public loading: boolean = false;
  public isMobile: any;
  public imageSvc: ImageService
  public wallImageSvc: WallImageService

  constructor(
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService,
    private toastr: ToastrService,
    private authSvc: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private collage: Collage,
    public setting: Setting
  ) {}

  async ngOnInit(): Promise<void> {
    this.isMobile = this.deviceService.isMobile();
    console.log("IsMobile", this.isMobile)

    const routeParams = this.route.snapshot.paramMap;
    this.setting.mode = routeParams.get('mode');
    this.imageSvc = new ImageService(this.api)
    this.wallImageSvc = new WallImageService(this.api)

    this.collage.onLoadingStateChanged = (state) => (this.loading = state)
    this.collage.onMenuItemClicked = (e) => this.onMenuItemClicked(e)

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return;
    }

    this.loading = true
    await this.imageSvc.updateImages();

    if (this.setting.mode == 'wall' && this.setting.selectedWallId) {
      this.collage.setSetting(this.setting.clone())
      await createCollageByWallId(this.collage, this.setting.selectedWallId)
    }

    this.loading = false
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  async onMenuItemClicked(e) {
    switch (e.target['id']) {
      case 'edit':
        await this.openImageEditWindow()
        break

      case 'crop':
        await this.openImageCropWindow()
        break

      case 'add':
        await this.openSelectImageWindow()
        break

      case 'delete':
        this.collage.deleteSelectedImage(this.setting.mode)
        break

      case 'background':
        this.setBackgroundImage()
        break

      case 'reset':
        const box: ImageBox = this.collage.getSelectedImage()
        box.reset()
        break
    }
  }

  async openImageEditWindow() {
    const box: ImageBox = this.collage.getSelectedImage()
    if (box.image != null) {
      this.dialog.open(ImageEditorComponent, {
        data: {
          imageBox: box
        },
        position: {
          left: "0px"
        },
      });
    }
  }

  async openImageCropWindow() {
    const box: ImageBox = this.collage.getSelectedImage()
    if (box.image != null) {
      const imageBase64 = box.getImageUrl()
      const board = box.getBoard()
      this.dialog.open(ImageCropperComponent, {
        width: "100%",
        height: "100%",
        data: {
          imageBase64: imageBase64,
          ratio: board.width / board.height,
          imageSvc: this.imageSvc
        },
      });
    }
  }

  async openSelectImageWindow() {
    if (this.setting.mode == 'select' || this.setting.mode == 'wall') {
      const images = this.imageSvc.thumbImages
      const dialogRef = this.dialog.open(ImageSelectComponent, {
        data: { images: images},
        width: (this.isMobile) ? "90%" : "50%"
      });
      dialogRef.afterClosed().subscribe(url => {
        if (url) {
          this.collage.onImageSelected(url)
        }
      })
    }
  }

  async onControlActionEvent(e) {
    if (e.action == "create_auto_collage") {
      this.collage.setSetting(this.setting.clone())
      await createAutoCollage(this.collage);
    }
    else if (e.action == "select_template") {
      this.loading = true
      await this.openSelectTemplateDialog()
      this.loading = false
    }
    else if (e.action == "select_wall") {
      this.loading = true
      await this.openSelectWallDialog()
      this.loading = false
    }
  }

  async openSelectTemplateDialog() {
    const data = await this.api.getTemplateList();
    if (data) {        
      const url = environment.apiUrl + "/collage/templates/image/";
      const images = data.map((it) => {
        return {
          id: it._id,
          src: url + it.image
        };
      });
      const dialogRef = this.dialog.open(SelectDialogComponent, {
        data: {
          "title": "Select Collage Template",
          "images": images
        },
        width: (this.isMobile) ? "90%" : "50%"
      });
      dialogRef.afterClosed().subscribe(async (itemId) => {
        if (itemId) {
          this.collage.setSetting(this.setting.clone())
          await createCollageByTemplateId(this.collage, itemId)
        }
      })
    }
  }

  async openSelectWallDialog() {
    const data = await this.api.getWallList();
    if (data) {        
      const url = environment.apiUrl + "/collage/wallframes/image/";
      const images = data.map((it) => {
        return {
          id: it._id,
          src: url + it.image
        };
      });
      const dialogRef = this.dialog.open(SelectDialogComponent, {
        data: {
          "title": "Select Wall Frame",
          "images": images
        },
        width: (this.isMobile) ? "90%" : "50%"
      });
      dialogRef.afterClosed().subscribe(async (itemId) => {
        console.log("itemId", itemId)
        if (itemId) {
          this.collage.setSetting(this.setting.clone())
          await createCollageByWallId(this.collage, itemId)
        }
      })
    }
  }

  async setBackgroundImage() {
    let images = this.imageSvc.thumbImages
    if (this.setting.mode == 'wall') {
      this.loading = true
      images = await this.wallImageSvc.updateImages()
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

  handleDrop(e) {
    this.collage.onHandleDrop(e.offsetX, e.offsetY)
    return false;
  }

  showCollages() {
    this.router.navigate(["/preview"]);
  }

  async saveCollage() {
    if (!this.collage.checkCanvas()) {
      this.toastr.error("Make a collage first")
      return
    }
    const userId = this.authSvc.getUserId()
    const slug = await this.collage.saveImage(userId)
    if (slug) {
      this.toastr.success("Success")
    }
    else {
      this.toastr.error("Failed to save collage")
    }
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

/*
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.setHeight(window.innerHeight);
    canvas.setWidth(window.innerWidth);
    canvas.renderAll();
}
*/
