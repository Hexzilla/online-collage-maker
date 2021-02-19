import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
})
export class MainNavComponent implements OnInit {
  selectedItem: number;

  menuItems = [
    { name: "Home", icon: "ac_unit", url: "https://m.printposters.in" },
    {
      name: "Canvas Prints",
      icon: "ac_unit",
      url: "https://m.printposters.in/canvas-prints",
    },
    {
      name: "Collage Maker",
      icon: "ac_unit",
      url: "https://m.printposters.in/online-collage-maker",
    },
    {
      name: "Photo Prints",
      icon: "card_giftcard",
      url: "https://m.printposters.in/photo-prints",
    },
    {
      name: "Poster Prints",
      icon: "card_giftcard",
      url: "https://m.printposters.in/poster-prints",
    },
    {
      name: "Vinyl Prints",
      icon: "card_giftcard",
      url: "https://m.printposters.in/vinyl-prints",
    },
    {
      name: "Banner Prints",
      icon: "card_giftcard",
      url: "https://m.printposters.in/banner-prints",
    },
  ];

  gallary = [
    { name: "Home", icon: "ac_unit", url: "https://m.printposters.in" },
    {
      name: "Canvas Prints",
      icon: "ac_unit",
      url: "https://m.printposters.in/canvas-prints",
    },
    {
      name: "Photo Prints",
      icon: "card_giftcard",
      url: "https://m.printposters.in/photo-prints",
    },
    {
      name: "Poster Prints",
      icon: "card_giftcard",
      url: "https://m.printposters.in/poster-prints",
    },
    {
      name: "Vinyl Prints",
      icon: "card_giftcard",
      url: "https://m.printposters.in/vinyl-prints",
    },
    {
      name: "Banner Prints",
      icon: "card_giftcard",
      url: "https://m.printposters.in/banner-prints",
    },
  ];

  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authSvc: AuthService,
    private router: Router
  ) {}

  categories: any;

  ngOnInit() {
    //this.getAllGalleryCats();
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  logout() {
    this.authSvc.logout();
  }

  navigate(url: any) {
    this.router.navigate([url]);
  }

  url: any;

  getAllGalleryCats() {
    
  }

  reloadLandingComp() {
    
  }

  removeSpace(str) {
    let newStringVal = str.replace(/ /g, "");
    return newStringVal;
  }

  setCategories(loadCatgory) {
    
  }

  isOpened: boolean = false;

  listClick(num) {
    this.selectedItem = num;
  }
  openCat() {
    this.isOpened = !this.isOpened;
    this.reloadLandingComp();
  }

  openUrl(url) {
    const win = window.open(url);
    win.focus();
    setTimeout(() => {
      const currentWindow = window;
      currentWindow.focus();
    }, 1000);
  }
}
