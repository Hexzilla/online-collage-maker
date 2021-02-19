import { Component, OnInit, Input } from "@angular/core";
import { PrintMenu } from "../print-menu/print-menu.component"
import { Collage } from "../collage/collage";
import { AuthService } from "../auth.service";
import { environment } from './../../environments/environment';

@Component({
  selector: "control-panel",
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.scss"],
})
export class ControlPanelComponent implements OnInit {
  public landscape: boolean = false;
  public width: number = 16;
  public height: number = 12;
  public borderWidth: number = 0;
  public borderColor: string = "rgb(90,160,70)";
  public collageWidth = [8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 54, 60];
  public collageHeight = [8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 54, 60];

  @Input() collageTemplate: boolean;

  constructor(
    private authSvc: AuthService,
    private collage: Collage
  ) {}

  ngOnInit() {
    // Remove mouse click on page
    document.addEventListener("contextmenu", (event) => event.preventDefault());
  }

  async createCollage() {
    await this.collage.createSmartCollage({
      widthInch: this.width,
      heightInch: this.height,
      landscape: this.landscape,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor
    });
  }

  async selectTemplate() {
    console.log('selectTemplate')
    //await this.collage.createCollageByTemplateId(1)
  }

  async saveTemplate() {
    await this.collage.saveTemplate();
  }

  async printCollage(way) {
    await this.collage.printCollageImage(way)
  }
}
