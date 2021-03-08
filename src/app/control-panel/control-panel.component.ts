import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Setting } from "../collage/setting";


@Component({
  selector: "control-panel",
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.scss"],
})
export class ControlPanelComponent implements OnInit {
  public collageWidth = [8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 54, 60];
  public collageHeight = [8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 54, 60];
  
  @Input() unitOfLength: string = "inch"
  @Input() showMarginSettings: boolean = false
  @Input() showTemplateButtons: boolean = false
  @Input() showCollageButtons: boolean = false
  @Input() showWallButtons: boolean = false
  @Output() actionEvent = new EventEmitter<any>();

  constructor(
    public setting: Setting,
  ) {}

  ngOnInit() {
    if (this.unitOfLength == "feet") {
      this.collageWidth = [], this.collageHeight = []
      for (let i = 10; i < 16; i++) {
        this.collageWidth.push(i);
        this.collageHeight.push(i);
      }
    }
  }

  onWidthChanged(e) {
    this.setting.canvasWidth = e.value
  }

  onHeightChanged(e) {
    this.setting.canvasHeight = e.value
  }

  onBorderSizeChanged(value) {
    this.setting.borderWidth = value
  }

  async createCollage() {
    this.actionEvent.emit({
      "action": "create_auto_collage"
    })
  }
  
  async selectTemplate() {
    this.actionEvent.emit({
      "action": "select_template"
    })
  }

  async selectWallFrame() {
    this.actionEvent.emit({
      "action": "select_wall"
    })
  }
  
  onCreateWallButtonClick() {
    this.actionEvent.emit({
      "action": "create_wall_frames"
    })
  }
  
  onCreateTemplateButtonClick() {
    this.actionEvent.emit({
      "action": "create_template"
    })
  }
}
