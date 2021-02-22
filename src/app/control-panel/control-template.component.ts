import { Component, OnInit, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Collage } from "../collage/collage";
import { Setting } from "../collage/setting";

@Component({
  selector: "control-template",
  templateUrl: "./control-template.component.html",
  styleUrls: ["./control-panel.component.scss"],
})
export class ControlTemplateComponent implements OnInit {
  public collageWidth = [8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 54, 60];
  public collageHeight = [8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 54, 60];

  constructor(
    private toastr: ToastrService,
    private setting: Setting,
    private collage: Collage
  ) {}

  ngOnInit() {
    // Remove mouse click on page
    document.addEventListener("contextmenu", (event) => event.preventDefault());
  }


  onWidthChanged(e) {
    this.setting.widthInch = e.value
  }

  onHeightChanged(e) {
    this.setting.heightInch = e.value
  }

  onBorderSizeChanged(value) {
    this.setting.borderWidth = value
  }
  
  createTemplate() {
    this.savedTemplate = null
    this.collage.createTemplate();
  }

  savedTemplate: any = null
  async saveTemplate() {
    if (this.savedTemplate) {
      const saved = await this.collage.saveTemplate(this.savedTemplate._id);
      if (saved) {
        this.toastr.success("Success");
        return
      }
    }
    else {
      this.savedTemplate = await this.collage.saveTemplate(0);
      if (this.savedTemplate) {
        this.toastr.success("Success");  
        return
      }
    }

    this.toastr.success("Failed to save template");  
  }

  /*async printCollage(way) {
    const userId = this.authSvc.getUserId()
    await this.collage.printCollageImage(userId, way)
  }*/
}
