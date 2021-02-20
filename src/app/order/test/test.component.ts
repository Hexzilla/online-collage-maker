import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  Renderer2,
  ElementRef,
  EventEmitter,
} from "@angular/core";
import * as _ from "lodash";
import { SharedService } from "src/app/shared.service";
import { MatDialog } from "@angular/material/dialog";
import { NeworderService } from "src/app/services/neworder.service";

export interface Size {
  fixedSize: number;
  recommendedSize: number;
  gallaryWrap: number;
  rolledCanvas: number;
  customerSelected: string;
}

@Component({
  selector: "app-size",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"],
})
export class TestComponent implements OnInit {
  @ViewChild("table", { static: false }) table;
  @Output() onSizeChange: EventEmitter<any> = new EventEmitter();
  imgConstant = [8, 10, 12, 16, 18, 20, 24, 30, 36, 42, 48, 60, 72, 84, 90];
  res: Size[] = [];
  private _img: any;
  customHeight: number[] = [];
  customWidth: number[] = [];
  selectedCustomHeight: number;
  selectedCustomWidth: number;
  gcustomRate: number;
  ccustomRate: number;
  imgsrc: any;
  dataUrl: any;

  mainImage = "assets/gallarybg/2.webp";
  bgimgs = [
    "assets/gallarybg/2.webp",
    "assets/gallarybg/3.webp",
    "assets/gallarybg/6.webp",
    "assets/gallarybg/7.webp",
    "assets/gallarybg/8.webp",
    "assets/gallarybg/9.webp",
    "assets/gallarybg/10.webp",
    "assets/gallarybg/12.webp",
    "assets/gallarybg/13.webp",
    "assets/gallarybg/15.webp",
    "assets/gallarybg/17.webp",
    "assets/gallarybg/18.webp",
  ];

  @Input()
  set size(val: any) {
    if (val) {
      this.show(val.height, val.width);
    }
  }

  roundOf(val: any) {
    return Math.round(val);
  }

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    private el: ElementRef,
    private sharedSvc: SharedService,
    private nos: NeworderService
  ) {
    this.imgsrc = this.nos.Img_HTML_edited;
    this._img = this.imgsrc;
    for (let i = 8; i <= 54; i++) {
      this.customHeight.push(i);
      this.customWidth.push(i);
    }
  }

  ngOnInit() {
    this.imgsrc = this.nos.Img_HTML_edited;
  }

  isImage(str, name) {
    if (str.indexOf(name) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  openDialog() {
    
  }

  show(a: any, b: any) {
    this.imgsrc = this.nos.Img_HTML_edited;

    const x = parseInt(a, 10);
    const y = parseInt(b, 10);
    this.customWidth = [];
    // step 1: calculate aspect ratio  first
    let ratio: number;
    let pixelSize: number;
    if (x > y) {
      ratio = x / y;
      pixelSize = _.ceil(y / 35, 4);
    } else {
      ratio = y / x;
      pixelSize = _.ceil(x / 35, 4);
    }

    // step 2: find recommended size
    this.res = [];
    this.imgConstant.forEach((ele) => {
      const checkRatio = _.round(ratio, 2);
      let finalRatio: any = false;
      if (checkRatio >= 1 && checkRatio <= 1.2) {
        finalRatio = 1;
      } else if (checkRatio >= 1.21 && checkRatio <= 1.29) {
        finalRatio = 1.25;
      } else if (checkRatio >= 1.3 && checkRatio <= 1.4) {
        finalRatio = 1.33;
      } else if (checkRatio >= 1.41 && checkRatio <= 1.55) {
        finalRatio = 1.5;
      } else if (checkRatio >= 1.56 && checkRatio <= 1.7) {
        finalRatio = 1.66;
      } else if (checkRatio >= 1.71 && checkRatio <= 1.9) {
        finalRatio = 1.75;
      } else if (checkRatio >= 1.91 && checkRatio <= 2.15) {
        finalRatio = 2;
      } else if (checkRatio >= 2.16 && checkRatio <= 2.5) {
        finalRatio = 2.35;
      } else if (checkRatio >= 2.51 && checkRatio <= 2.75) {
        finalRatio = 2.5;
      } else if (checkRatio >= 2.76 && checkRatio <= 3.25) {
        finalRatio = 3;
      }
      const recSize = Math.round(ele * finalRatio);
      // removed this block below so as to show all the possible imaage size.
      if (finalRatio && recSize < 96 && pixelSize > ele) {
        this.res.push({
          fixedSize: ele,
          recommendedSize: recSize,
          gallaryWrap: 0,
          rolledCanvas: 0,
          customerSelected: "none",
        });
      }
    });

    // step 3: find the total feet
    let i = 0;
    for (const ele of this.res) {
      let t1 = _.round(ele.fixedSize / 12, 0.1);
      let t2 = _.round(ele.recommendedSize / 12, 1);

      if (ele.recommendedSize < 13) {
        t2 = 1;
      }
      if (ele.recommendedSize >= 13) {
        t2 = 1.5;
      }
      if (ele.recommendedSize >= 19) {
        t2 = 2;
      }
      if (ele.recommendedSize >= 25) {
        t2 = 2.5;
      }
      if (ele.recommendedSize === 36) {
        t2 = 3;
      }
      if (ele.recommendedSize >= 37) {
        t2 = 3.5;
      }
      if (ele.recommendedSize === 48) {
        t2 = 4;
      }
      if (ele.recommendedSize >= 49) {
        t2 = 4.5;
      }
      if (ele.recommendedSize === 60) {
        t2 = 5;
      }
      if (ele.recommendedSize >= 61) {
        t2 = 5.5;
      }
      if (ele.recommendedSize === 72) {
        t2 = 6;
      }
      if (ele.recommendedSize >= 73) {
        t2 = 6.5;
      }
      if (ele.fixedSize >= 13) {
        t1 = 1.5;
      }
      if (ele.fixedSize >= 19) {
        t1 = 2;
      }
      if (ele.fixedSize >= 25) {
        t1 = 2.5;
      }
      if (ele.fixedSize === 36) {
        t1 = 3;
      }
      if (ele.fixedSize >= 37) {
        t1 = 3.5;
      }
      if (ele.fixedSize === 48) {
        t1 = 4;
      }
      if (ele.fixedSize >= 49) {
        t1 = 4.5;
      }
      if (ele.fixedSize === 60) {
        t1 = 5;
      }
      if (ele.fixedSize >= 61) {
        t1 = 5.5;
      }
      if (ele.fixedSize === 72) {
        t1 = 6;
      }
      if (ele.fixedSize >= 73) {
        t1 = 6.5;
      }
      let total = t1 * t2;
      const inches = ele.fixedSize * ele.recommendedSize;
      if (total <= 1) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (400 / 144 / 0.6));
          let b = Math.round(inches * (600 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        } else {
          let a = Math.round(inches * (500 / 144 / 0.6));
          let b = Math.round(inches * (700 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        }
      } else if (total <= 2) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (390 / 144 / 0.6));
          let b = Math.round(inches * (540 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        } else {
          let a = Math.round(inches * (390 / 144 / 0.6));
          let b = Math.round(inches * (670 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        }
      } else if (total <= 3) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (330 / 144 / 0.6));
          let b = Math.round(inches * (475 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        } else {
          let a = Math.round(inches * (330 / 144 / 0.6));
          let b = Math.round(inches * (550 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        }
      } else if (total <= 4) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (270 / 144 / 0.6));
          let b = Math.round(inches * (425 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        } else {
          let a = Math.round(inches * (320 / 144 / 0.6));
          let b = Math.round(inches * (500 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        }
      } else if (total <= 5) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (270 / 144 / 0.6));
          let b = Math.round(inches * (400 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        } else {
          let a = Math.round(inches * (320 / 144 / 0.6));
          let b = Math.round(inches * (475 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        }
      } else if (total <= 6) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (230 / 144 / 0.6));
          let b = Math.round(inches * (400 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        } else {
          let a = Math.round(inches * (270 / 144 / 0.6));
          let b = Math.round(inches * (475 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        }
      } else if (total <= 7) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (230 / 144 / 0.6));
          let b = Math.round(inches * (380 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        } else {
          let a = Math.round(inches * (260 / 144 / 0.6));
          let b = Math.round(inches * (430 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        }
      } else {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (230 / 144 / 0.6));
          let b = Math.round(inches * (360 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        } else {
          let a = Math.round(inches * (260 / 144 / 0.6));
          let b = Math.round(inches * (430 / 144 / 0.6));

          this.res[i].rolledCanvas = a;
          this.res[i].gallaryWrap = b;
        }
      }
      i++;
    }
  }

  calculatePixelSize(n: number) {
    return n / 35;
  }

  calculateAspectRatio(a: number, b: number) {
    return Math.round(a / b);
  }

  onSizeSelected(ev: any, i: Size, type: string) {
    this.sharedSvc.cropHeight = undefined;
    this.sharedSvc.cropWidth = undefined;
    this.changeColor(ev);
    this.onSizeChange.emit({ size: i, selectedType: type });
    this.resetRate();
  }

  changeColor(ev: any) {
    Array.from(this.table.nativeElement.children[0].children).forEach(
      (tr: any) => {
        Array.from(tr.children).forEach((td: any) => {
          if (td.bgColor !== "") {
            td.bgColor = "";
          }
        });
      }
    );
    ev.target.bgColor = "#ffd740";
  }

  showCustomPrice() {
    if (this.selectedCustomHeight >= 8 && this.selectedCustomWidth >= 8) {
      const ele = {
        fixedSize: this.selectedCustomHeight,
        recommendedSize: this.selectedCustomWidth,
      };

      let t1 = _.round(ele.fixedSize / 12, 0.1);
      let t2 = _.round(ele.recommendedSize / 12, 1);
      if (ele.recommendedSize < 13) {
        t2 = 1;
      }
      if (ele.recommendedSize >= 13) {
        t2 = 1.5;
      }
      if (ele.recommendedSize >= 19) {
        t2 = 2;
      }
      if (ele.recommendedSize >= 25) {
        t2 = 2.5;
      }
      if (ele.recommendedSize === 36) {
        t2 = 3;
      }
      if (ele.recommendedSize >= 37) {
        t2 = 3.5;
      }
      if (ele.recommendedSize === 48) {
        t2 = 4;
      }
      if (ele.recommendedSize >= 49) {
        t2 = 4.5;
      }
      if (ele.recommendedSize === 60) {
        t2 = 5;
      }
      if (ele.recommendedSize >= 61) {
        t2 = 5.5;
      }
      if (ele.recommendedSize === 72) {
        t2 = 6;
      }
      if (ele.recommendedSize >= 73) {
        t2 = 6.5;
      }
      if (ele.fixedSize >= 13) {
        t1 = 1.5;
      }
      if (ele.fixedSize >= 19) {
        t1 = 2;
      }
      if (ele.fixedSize >= 25) {
        t1 = 2.5;
      }
      if (ele.fixedSize === 36) {
        t1 = 3;
      }
      if (ele.fixedSize >= 37) {
        t1 = 3.5;
      }
      if (ele.fixedSize === 48) {
        t1 = 4;
      }
      if (ele.fixedSize >= 49) {
        t1 = 4.5;
      }
      if (ele.fixedSize === 60) {
        t1 = 5;
      }
      if (ele.fixedSize >= 61) {
        t1 = 5.5;
      }
      if (ele.fixedSize === 72) {
        t1 = 6;
      }
      if (ele.fixedSize >= 73) {
        t1 = 6.5;
      }
      let total = t1 * t2;

      const inches = ele.fixedSize * ele.recommendedSize;
      if (total <= 1) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (400 / 144 / 0.6));
          let b = Math.round(inches * (600 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (500 / 144 / 0.6));
          let b = Math.round(inches * (700 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        }
      } else if (total <= 2) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (390 / 144 / 0.6));
          let b = Math.round(inches * (540 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (390 / 144 / 0.6));
          let b = Math.round(inches * (670 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        }
      } else if (total <= 3) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (330 / 144 / 0.6));
          let b = Math.round(inches * (475 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (330 / 144 / 0.6));
          let b = Math.round(inches * (550 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        }
      } else if (total <= 4) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (270 / 144 / 0.6));
          let b = Math.round(inches * (425 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (320 / 144 / 0.6));
          let b = Math.round(inches * (500 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        }
      } else if (total <= 5) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (270 / 144 / 0.6));
          let b = Math.round(inches * (400 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (320 / 144 / 0.6));
          let b = Math.round(inches * (475 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        }
      } else if (total <= 6) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (230 / 144 / 0.6));
          let b = Math.round(inches * (400 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (270 / 144 / 0.6));
          let b = Math.round(inches * (475 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        }
      } else if (total <= 7) {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (230 / 144 / 0.6));
          let b = Math.round(inches * (380 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (260 / 144 / 0.6));
          let b = Math.round(inches * (430 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        }
      } else {
        let fixfound = false;
        let recfound = false;
        for (const it of this.imgConstant) {
          if (ele.fixedSize === it) {
            fixfound = true;
          }
          if (ele.recommendedSize === it) {
            recfound = true;
          }
        }

        if (fixfound && recfound) {
          let a = Math.round(inches * (230 / 144 / 0.6));
          let b = Math.round(inches * (360 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (260 / 144 / 0.6));
          let b = Math.round(inches * (430 / 144 / 0.6));

          this.ccustomRate = a;
          this.gcustomRate = b;
        }
      }
    }
  }

  resetRate() {
    if (this.selectedCustomHeight && this.selectedCustomWidth) {
      this.selectedCustomHeight = undefined;
      this.selectedCustomWidth = undefined;
      this.gcustomRate = 0;
      this.ccustomRate = 0;
    }
  }

  setCustomSize(selectedType: any) {
    let s: Size;
    if (this.nos.File_edited) {
      this.sharedSvc.img = this.imgsrc;
      s = {
        fixedSize: this.selectedCustomHeight,
        recommendedSize: this.selectedCustomWidth,
        gallaryWrap: this.gcustomRate,
        rolledCanvas: this.ccustomRate,
        customerSelected: "none",
      };
    } else {
      alert("crop image first");
    }

    this.onSizeChange.emit({ size: s, selectedType });
  }

  getDiscount(amount: any) {
    let val: any = amount - amount * (parseInt("40", 10) / 100);
    val = val.toFixed(2);
    return "After Discount: Rs. " + val;
  }
}
