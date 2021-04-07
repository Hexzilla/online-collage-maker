import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MenuService } from '../services/menu.service';
import { HelperService } from '../helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

  menuItems = [
    { name: 'Home', icon: 'ac_unit', url: 'https://m.printposters.in' },
    { name: 'Canvas Prints', icon: 'ac_unit', url: 'https://m.printposters.in/canvas-prints' },
    { name: 'Photo Prints', icon: 'card_giftcard', url: 'https://m.printposters.in/photo-prints' },
    { name: 'Poster Prints', icon: 'card_giftcard', url: 'https://m.printposters.in/poster-prints' },
    { name: 'Vinyl Prints', icon: 'card_giftcard', url: 'https://m.printposters.in/vinyl-prints' },
    { name: 'Banner Prints', icon: 'card_giftcard', url: 'https://m.printposters.in/banner-prints' }
  ];

  currentMenu: any;
  menus = [];
  submenus: any = {};
  currentUrl: any;
  env: any;

  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authSvc: AuthService,
    private router: Router,
    private ms: MenuService,
    private helper: HelperService
  ) {
    this.env = environment;
    this.currentUrl = window.location.pathname;
  }

  ngOnInit() {
    this.getMenus();
  }

  getMenus() {
    this.ms.getMenus().subscribe((resp: any) => {
      if (resp.success) {
        this.menus = resp.menus;
      } else {
        this.helper.showSnackbar(resp.msg);
      }
    }, () => {
      this.helper.showSnackbar(`Internal Server Error`);
    });
  }

  loadSubMenus(menuId: any) {
    this.currentMenu = menuId;
    if (this.submenus[menuId] && this.submenus[menuId].length) {
      return;
    }
    this.ms.getSubmenus(menuId).subscribe((resp: any) => {
      if (resp.success) {
        this.submenus[menuId] = resp.types;
      } else {
        this.helper.showSnackbar(resp.msg);
      }
    }, () => {
      this.helper.showSnackbar(`Internal Server Error`);
    });
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

}
