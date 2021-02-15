import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from 'src/datamodel/user';
import { AuthService } from '../auth.service';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { HelperService } from '../helper.service';
import { NewOrder } from 'src/datamodel/newOrder';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  orders: any = [];
  allorders: any = [];
  newOrders = [];
  environment: any;

  constructor(
    private userSvc: UserService,
    private authSvc: AuthService,
    private helperSvc: HelperService,
    private router: Router
  ) { }

  ngOnInit() {
    document.querySelector('mat-sidenav-content').scroll(0, 0);
    // this.userSvc.getCurrentUser(this.authSvc.fbUser.uid).subscribe((r:User)=>{
    //   if(r){
    //     this.user=r;
    //   }
    // })
    this.environment = environment;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.authSvc.getProfile().subscribe((profile: any) => {
      this.authSvc.fetchOrders(profile.user._id)
        .subscribe((data: any) => {
          this.orders = data.orders;
          // console.log(this.orders);
        });
      // this.authSvc.fetchAllOrders()
      //   .subscribe((data: any) => {
      //     this.allorders = data.orders;
      //     console.log(this.allorders);
      //   });
    });
    this.authSvc.getProfile().subscribe((res: any) => {
      if (res.success) {
        // this.helperSvc.showSnackbar('User Fetched Successfully');
      } else {
        this.helperSvc.showSnackbar(res.msg);
      }
    });
  }

  toggleRole() {
    const id = this.user.id;
    this.userSvc.toggleUserRole(id)
      .subscribe((resp: any) => {
        if (resp.success) {
          this.helperSvc.showSnackbar('You Are now an admin');
        } else {
          this.helperSvc.showSnackbar(resp.msg);
        }
      }, err => {
        this.helperSvc.showSnackbar(err.message);
      });
  }

  // logout(){
  //   this.authSvc.signOut().then(()=>{
  //     this.helperSvc.showSnackbar('Logout Successfully');
  //     this.router.navigate(['home']);
  //   },err=>{
  //     this.router.navigate(['home']);
  //     this.helperSvc.showSnackbar('Error in logging out');
  //   })
  // }

  logout() {
    this.authSvc.logout();
  }
}
