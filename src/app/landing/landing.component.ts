import { Component, OnInit } from "@angular/core";
import { ProductService } from "../product.service";
import { Content } from "src/datamodel/content";
import { Router } from "@angular/router";
import { MatCarousel, MatCarouselComponent } from "@ngbmodule/material-carousel";
import * as _ from "lodash";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  slides = [
    {
      image: "assets/banners/banner1.webp",
    },
    {
      image: "assets/banners/banner2.webp",
    },
    {
      image: "assets/banners/banner3.webp",
    },
  ];

  customHeight: number[] = [];
  customWidth: number[] = [];
  selectedCustomHeight: number;
  selectedCustomWidth: number;
  gcustomRate: number;
  ccustomRate: number;
  imgConstant = [8, 10, 12, 16, 18, 20, 24, 30, 36, 42, 48, 60];

  contents: Content[];

  prices = [
    {
      size: '8" x 8"',
      value: "276",
      yourPrice: "178",
    },
    {
      size: '8" x 12"',
      value: "414",
      yourPrice: "267",
    },
    {
      size: '18" x 24"',
      value: "1534",
      yourPrice: "990",
    },
    {
      size: '24" x 36"',
      value: "2139",
      yourPrice: "1380",
    },
    {
      size: '36" x 48"',
      value: "4278",
      yourPrice: "2760",
    },
  ];

  constructor(private router: Router) {
    for (let i = 8; i <= 54; i++) {
      this.customHeight.push(i);
    }
    for (let i = 8; i <= 90; i++) {
      this.customWidth.push(i);
    }
  }

  ngOnInit() {
    console.log("landing.component");
    document.querySelector("mat-sidenav-content").scroll(0, 0);
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
          let a = Math.round(inches * (400 / 144));
          let b = Math.round(inches * (600 / 144));

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (500 / 144));
          let b = Math.round(inches * (700 / 144));

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
          let a = Math.round(inches * (390 / 144));
          let b = Math.round(inches * (540 / 144));
          console.log("gt4 => a:" + a, "b:" + b, "total: " + total);

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (390 / 144));
          let b = Math.round(inches * (670 / 144));

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
          let a = Math.round(inches * (330 / 144));
          let b = Math.round(inches * (475 / 144));
          console.log("gt4 => a:" + a, "b:" + b, "total: " + total);

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (330 / 144));
          let b = Math.round(inches * (550 / 144));

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
          let a = Math.round(inches * (270 / 144));
          let b = Math.round(inches * (425 / 144));
          console.log("gt4 => a:" + a, "b:" + b, "total: " + total);

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (320 / 144));
          let b = Math.round(inches * (500 / 144));

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
          let a = Math.round(inches * (270 / 144));
          let b = Math.round(inches * (400 / 144));
          console.log("gt4 => a:" + a, "b:" + b, "total: " + total);

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (320 / 144));
          let b = Math.round(inches * (475 / 144));

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
          let a = Math.round(inches * (230 / 144));
          let b = Math.round(inches * (400 / 144));
          console.log("gt4 => a:" + a, "b:" + b, "total: " + total);

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (270 / 144));
          let b = Math.round(inches * (475 / 144));

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
          let a = Math.round(inches * (230 / 144));
          let b = Math.round(inches * (380 / 144));
          console.log("gt4 => a:" + a, "b:" + b, "total: " + total);

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (260 / 144));
          let b = Math.round(inches * (430 / 144));

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
          let a = Math.round(inches * (230 / 144));
          let b = Math.round(inches * (360 / 144));

          this.ccustomRate = a;
          this.gcustomRate = b;
        } else {
          let a = Math.round(inches * (260 / 144));
          let b = Math.round(inches * (430 / 144));

          this.ccustomRate = a;
          this.gcustomRate = b;
        }
      }
    }
  }

  order(p: Content) {
    if (p.type == "canvas") {
      this.router.navigateByUrl("order");
    }
  }
}
