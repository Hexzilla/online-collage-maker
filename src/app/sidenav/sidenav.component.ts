import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


const SMALL_WITH_BREAKPOINT = 720;


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent implements OnInit {

  menuItems = [
    { name: 'Home', icon: 'home', url: '/home' },
    { name: 'Canvas Prints', icon: 'home', url: '/product' },
    { name: 'Framed Prints', icon: 'home', url: '/product' },
    { name: 'Metal Prints', icon: 'home', url: '/product' },
    { name: 'Acrylic Prints', icon: 'home', url: '/product' },
    { name: 'Photo Prints', icon: 'home', url: '/product' },
    { name: 'Special Offers', icon: 'local_offer', url: '' },
    { name: 'Sizing & Pricing', icon: 'local_atm', url: '' },
    { name: 'Photo Gifts', icon: 'card_giftcard', url: '' },
    { name: 'Occasions', icon: 'highlight', url: '' },
    { name: 'Bulk Orders', icon: 'airport_shuttle', url: '' },
    { name: 'Idea Gallery', icon: 'ac_unit', url: '' },
    { name: 'Testimonial', icon: 'folder_special', url: '' },
    { name: 'About Us', icon: 'alternate_email', url: '' },
  ];

  showFiller = false;

  constructor(
    private router: Router,
    private authSvc: AuthService
  ) { }

  ngOnInit() {

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

  // showAccount() {
  //   // console.log('show accounts');
  //   this.authSvc.isAuthenticated().subscribe(r => {
  //     if (r) {
  //       // console.log('user authenticated..show profile');
  //       this.router.navigate(['profile']);
  //     } else {
  //       // console.log('user is not authenticated');
  //       this.router.navigate(['login']);
  //     }
  //   }, err => {
  //     // console.log('user is not authenticated');
  //     this.router.navigate(['login']);
  //   });
  // }

  showShoppingCart() {
    // console.log('show shopping cart');
    this.router.navigate(['cart']);
  }
}
