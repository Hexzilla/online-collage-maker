import { Component, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Collage } from "../collage/collage";
import { Setting } from "../collage/setting";
import { SelectTemplateComponent } from "./select-template.component";

@Component({
  selector: "control-panel",
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.scss"],
})
export class ControlPanelComponent implements OnInit {
  public collageWidth = [8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 54, 60];
  public collageHeight = [8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 54, 60];

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    public setting: Setting,
    private collage: Collage
  ) {}

  ngOnInit() {
    // Remove mouse click on page
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    console.log('~~~', this.setting)
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

  async createCollage() {
    this.savedTemplate = null
    await this.collage.createAutoCollage();
  }

  async selectTemplate() {
    console.log('selectTemplate')
    this.dialog.open(SelectTemplateComponent, {
      data: {},
    });
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
