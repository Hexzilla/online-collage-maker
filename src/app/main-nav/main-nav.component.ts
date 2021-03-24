import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { MenuService } from '../services/menu.service';
import { HelperService } from '../helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {

  url: any;
  selectedItem: number;
  isOpened = false;

  menuItems = [
    { name: 'Home', icon: 'ac_unit', url: 'https://m.printposters.in' },
    {
      name: 'Canvas Prints',
      icon: 'ac_unit',
      url: 'https://m.printposters.in/canvas-prints',
    },
    {
      name: 'Photo Prints',
      icon: 'card_giftcard',
      url: 'https://m.printposters.in/photo-prints',
    },
    {
      name: 'Poster Prints',
      icon: 'card_giftcard',
      url: 'https://m.printposters.in/poster-prints',
    },
    {
      name: 'Vinyl Prints',
      icon: 'card_giftcard',
      url: 'https://m.printposters.in/vinyl-prints',
    },
    {
      name: 'Banner Prints',
      icon: 'card_giftcard',
      url: 'https://m.printposters.in/banner-prints',
    },
  ];

  gallary = [
    { name: 'Home', icon: 'ac_unit', url: 'https://m.printposters.in' },
    {
      name: 'Canvas Prints',
      icon: 'ac_unit',
      url: 'https://m.printposters.in/canvas-prints',
    },
    {
      name: 'Photo Prints',
      icon: 'card_giftcard',
      url: 'https://m.printposters.in/photo-prints',
    },
    {
      name: 'Poster Prints',
      icon: 'card_giftcard',
      url: 'https://m.printposters.in/poster-prints',
    },
    {
      name: 'Vinyl Prints',
      icon: 'card_giftcard',
      url: 'https://m.printposters.in/vinyl-prints',
    },
    {
      name: 'Banner Prints',
      icon: 'card_giftcard',
      url: 'https://m.printposters.in/banner-prints',
    },
  ];
  currentMenu: any;
  menus = [];
  submenus: any = {};
  currentUrl: any;
  env: any;

  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authSvc: AuthService,
    private router: Router,
    private ms: MenuService,
    private helper: HelperService,
    private prdsvc: ProductService
  ) {
    this.env = environment;
    this.currentUrl = window.location.pathname;
  }

  categories: any;

  ngOnInit(): void {
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

  loggedIn(): any {
    return this.authSvc.loggedIn();
  }

  logout(): any {
    this.authSvc.logout();
  }

  navigate(url: any): any {
    this.router.navigate([url]);
  }

  getAllGalleryCats(): any {
    this.prdsvc.getGalleryCats().subscribe(
      (resp: any) => {
        if (resp.success) {
          this.categories = resp.data;
          // console.log(resp.data);
          for (let i = 0; i < this.categories.length; i++) {
            this.categories[i].url =
              'https://m.printposters.in/gallery/category/' +
              this.removeSpace(this.categories[i].title);
            if (i === 0) {
              this.url =
                'https://m.printposters.in/gallery/category/' +
                this.removeSpace(this.categories[i].title);
              // this.router.navigateByUrl('/category/'+url);
            }
          }
        } else {
          console.log(resp.msg);
        }
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  reloadLandingComp(): any {
    this.prdsvc.reloadComp();
  }

  removeSpace(str: any): any {
    const newStringVal = str.replace(/ /g, '');
    return newStringVal;
  }

  setCategories(loadCatgory: any): any {
    this.selectedItem = loadCatgory;
    this.prdsvc.loadImageCategory(loadCatgory);
  }


  listClick(num: any): any {
    this.selectedItem = num;
  }
  openCat(): any {
    this.isOpened = !this.isOpened;
    this.reloadLandingComp();
  }

  openUrl(url: any): any {
    const win = window.open(url);
    win.focus();
    setTimeout(() => {
      const currentWindow = window;
      currentWindow.focus();
    }, 1000);
  }
}
