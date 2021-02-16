import { Component, OnInit, Input } from "@angular/core";
import { Collage } from "../collage/collage";
import { Setting } from "../collage/setting";

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

  constructor(private collage: Collage) {}

  ngOnInit() {}

  createCollage() {
    this.collage.createCollage({
      widthInch: this.width,
      heightInch: this.height,
      landscape: this.landscape,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor
    });
  }

  async selectTemplate() {
    const template = {      
      "_id":"602affe0e8797a26200a6a96",
      "width":"8",
      "height":"12",
      "boardWidth":"0",
      "borderColor":"rgb(90,160,70)",
      "created_at":"2021-02-15T23:12:32.499Z",
      "updated_at":"2021-02-15T23:12:32.499Z",
      "__v":0,
      "images":[
        {"url":"","offsetX":0,"offsetY":0,"initialScale":1.3870967741935485,"scale":1.3870967741935485,"zoom":1,"brightness":0.01,"cropRect":null},
        {"url":"","offsetX":582.5806451612904,"offsetY":0,"initialScale":1.3821428571428571,"scale":1.3821428571428571,"zoom":1,"brightness":0.01,"cropRect":null},
        {"url":"","offsetX":0,"offsetY":387,"initialScale":1.2214285714285715,"scale":1.2214285714285715,"zoom":1,"brightness":0.01,"cropRect":null},
        {"url":"","offsetX":513,"offsetY":387,"initialScale":1.5545454545454545,"scale":1.5545454545454545,"zoom":1,"brightness":0.01,"cropRect":null},
        {"url":"","offsetX":0,"offsetY":729,"initialScale":1.006578947368421,"scale":1.006578947368421,"zoom":1,"brightness":0.01,"cropRect":null},
        {"url":"","offsetX":422.7631578947368,"offsetY":729,"initialScale":0.8337874659400545,"scale":0.8337874659400545,"zoom":1,"brightness":0.01,"cropRect":null},
        {"url":"","offsetX":772.9538935895597,"offsetY":729,"initialScale":0.9357798165137615,"scale":0.9357798165137615,"zoom":1,"brightness":0.01,"cropRect":null},
        {"url":"","offsetX":0,"offsetY":1035,"initialScale":1.019108280254777,"scale":1.019108280254777,"zoom":1,"brightness":0.01,"cropRect":null},
        {"url":"","offsetX":428.02547770700636,"offsetY":1035,"initialScale":0.6060606060606061,"scale":0.6060606060606061,"zoom":1,"brightness":0.01,"cropRect":null},
        {"url":"","offsetX":682.5709322524609,"offsetY":1035,"initialScale":1.1428571428571428,"scale":1.1428571428571428,"zoom":1,"brightness":0.01,"cropRect":null}
      ]
    }

    const templateId = 1
    await this.collage.createBoardByTemplateId(templateId)
  }

  saveTemplate() {
    this.collage.saveTemplate();
  }
}
