import { Component, OnInit, Input } from "@angular/core";
import { PrintMenu } from "../print-menu/print-menu.component"
import { ToastrService } from "ngx-toastr";
import { Collage } from "../collage/collage";
import { AuthService } from "../auth.service";

@Component({
  selector: "control-template",
  templateUrl: "./control-template.component.html",
  styleUrls: ["./control-panel.component.scss"],
})
export class ControlTemplateComponent implements OnInit {
  public landscape: boolean = false;
  public width: number = 16;
  public height: number = 12;
  public borderWidth: number = 0;
  public borderColor: string = "rgb(90,160,70)";
  public collageWidth = [8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 54, 60];
  public collageHeight = [8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 54, 60];

  constructor(
    private toastr: ToastrService,
    private authSvc: AuthService,
    private collage: Collage
  ) {}

  ngOnInit() {
    // Remove mouse click on page
    document.addEventListener("contextmenu", (event) => event.preventDefault());
  }

  createTemplate() {
    this.savedTemplate = null
    this.collage.createTemplate({
      widthInch: this.width,
      heightInch: this.height,
      landscape: this.landscape,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor
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
