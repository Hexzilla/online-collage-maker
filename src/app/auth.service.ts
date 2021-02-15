// import { AngularFireAuth } from '@angular/fire/auth';

import { UserService } from './user.service';
import { User } from '../datamodel/user';
import { Observable } from 'rxjs/internal/Observable';

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { HelperService } from './helper.service';
import { NeworderService } from './services/neworder.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  authToken: any;
  imgsrc: any;
  user: any;
  public isLoggedIn = false;
  //public fbUser: firebase.User;

  constructor(
    // public afAuth: AngularFireAuth,
    private userSvc: UserService,
    private nos: NeworderService,

    private http: HttpClient, private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private helper: HelperService
  ) {

  }

  setimgsrc(src) {
    this.imgsrc = src;
  }

  getimgsrc() {
    return this.imgsrc;
  }

  // isAuthenticated() {
  //   return new Observable(o => {
  //     this.afAuth.authState.subscribe(r => {
  //       if (r) {
  //         this.isLoggedIn = true;
  //         this.fbUser = r;
  //         o.next(r);
  //       } else {
  //         this.isLoggedIn = false;
  //         o.next(r);
  //       }

  //     });
  //   });
  // }
  // loginWithEmail(email: string, password: string) {
  //   return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  // }

  loginWithGoogle() {

  }

  loginWithFacebook() {

  }

  loginWithTwitter() {

  }

  // signUpWithEmail(email: string, password: string, firstname: string, lastname: string, mobile: string) {
  //   return new Promise((resolve, reject) => {
  //     this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(res => {
  //       const user: User = {
  //         billingAddress: '',
  //         email,
  //         firstname,
  //         lastname,
  //         mobile,
  //         shippingAddres: '',
  //         uid: res.user.uid,
  //         photoUrl: res.user.photoURL
  //       };
  //       // const user: User = {
  //       //   billingAddress: '',
  //       //   email: email,
  //       //   firstname: firstname,
  //       //   lastname: lastname,
  //       //   mobile: mobile,
  //       //   shippingAddres: '',
  //       //   uid: res.user.uid,
  //       //   photoUrl: res.user.photoURL
  //       // }
  //       this.userSvc.createUser(user).then(() => {
  //         resolve();
  //       }, err => {
  //         reject(err);
  //       });
  //     }, err => {
  //       reject(err);
  //     });
  //   });

  // }

  // signOut() {
  //   return this.afAuth.auth.signOut().then(r => {
  //     this.isLoggedIn = false;
  //     this.fbUser = null;
  //   });
  // }


  register(user) {
    // const headers = new HttpHeaders();
    // headers.append('Content-Type', 'application/json');
    this.http.post(environment.url + '/users/register', {
      name: user.firstname + ' ' + user.lastname,
      // "username":user.username,
      email: user.email,
      mobile: user.mobile,
      password: user.password
    }).subscribe((data: any) => {
      if (data.success) {
        this.helper.showSnackbar(data.msg);
        this.router.navigate(['/login']);
      } else {
        this.helper.showSnackbar(data.msg);
      }
    });
  }

  authenticateUser(user) {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    this.http.post(environment.url + '/users/authenticate', {
      username: user.email,
      password: user.password
    }).subscribe((data: any) => {
      if (data.success) {
        this.storeUserData(data.token, data.user, data.cart, data.address);
        this.helper.showSnackbar(data.msg);
        history.back();
      } else {
        this.helper.showSnackbar(data.msg);
      }
    });
  }

  authenticateUserObs(user) {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    this.http.post(environment.url + '/users/authenticate', {
      username: user.email,
      password: user.password
    }).subscribe((data: any) => {
      if (data.success) {
        this.storeUserData(data.token, data.user, data.cart, data.address);
        this.helper.showSnackbar(data.msg);
        // history.back();
      } else {
        this.helper.showSnackbar(data.msg);
      }
    });
  }

  sendOtp(email, mobile, otp) {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    return this.http.post(environment.url + '/users/requestOTP',
      {
        email,
        mobile,
        otp
      });
  }

  placeOrder(newOrder) {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    this.http.post(environment.url + '/orders/register', newOrder)
      .subscribe((data: any) => {
        if (data.success) {
          // localStorage.setItem("ct_item", "[]");
          // this.updateCartInUserDb(JSON.parse(localStorage.getItem('user')).id,"[]").subscribe(data => {
          // });
          this.helper.showSnackbar('Order Placed Successfully');
          localStorage.setItem('newOrders', '[]');

          localStorage.setItem('successAmount', newOrder.amount);
          localStorage.setItem('successId', newOrder.orderId);

          this.nos.newOrders = [];
          this.router.navigate(['/success']);
        } else {
          this.helper.showSnackbar('Try Again');
        }
      });
  }

  fetchOrders(userid) {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    return this.http.get(environment.url + '/orders/userorders/' + userid);
  }

  fetchAllOrders() {
    const headers = new HttpHeaders();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    // headers.append('Content-Type', 'application/json');
    return this.http.get(environment.url + '/orders/orderList/', { headers });
  }

  forgotPassword(otp, email) {
    const headers = new HttpHeaders();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    // headers.append('Content-Type', 'application/json');
    return this.http.post(environment.url + '/mails/forgotPasswordOTP/', {otp, email}, { headers });
  }

  updatePassword(email, password) {
    const headers = new HttpHeaders();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    // headers.append('Content-Type', 'application/json');
    return this.http.post(environment.url + '/users/updatePasswordViaMail', {email, password}, { headers });
  }

  getProfile() {
    const headers = new HttpHeaders();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    // headers.append('Content-Type', 'application/json');
    return this.http.get(environment.url + '/users/profile', { headers });
  }

  updateCartInUserDb(id, products) {
    const headers = new HttpHeaders();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    // headers.append('Content-Type', 'application/json');
    return this.http.post(environment.url + '/users/addToCart',
      {
        id,
        cart: products
      }, { headers });
  }

  storeUserData(token, user, cart, address) {
    console.log('StoreUserData-Token', token)
    console.log('StoreUserData-User', user)
    console.log('StoreUserData-Address', address)
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('id_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('ct_item', cart);
      localStorage.setItem('usr_adr', address);
    }
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('id_token');
      this.authToken = token;
    }
  }

  loggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.user) {
        return true;
      } else {
        const helper = new JwtHelperService();
        return !helper.isTokenExpired(localStorage.getItem('id_token'));
      }
    }
    return false;
  }

  logout() {
    this.authToken = null;
    this.user = null;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.helper.showSnackbar('You are logged out!');
    this.router.navigate(['/']);
  }

  getUserId() {
    if (localStorage.user) {
      return localStorage.user.id;
    }
    return '';
  }

  updateAddress(address) {

    this.getProfile().subscribe((data: any) => {

      if (isPlatformBrowser(this.platformId)) {
        const id = data.user._id;
        const a = JSON.parse(localStorage.getItem('usr_adr')) || [];
        address.key = Date.now();
        a.push(address);
        localStorage.setItem('usr_adr', JSON.stringify(a));
        this.updateAddressInUserDb(id, JSON.stringify(a)).subscribe((data1: any) => {
          this.helper.showSnackbar('Address Added');
        });
      }
    });
  }
  updateAddressInUserDb(id, address) {
    const headers = new HttpHeaders();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    // headers.append('Content-Type', 'application/json');
    return this.http.post(environment.url + '/users/updateAddress',
      {
        id,
        address
      }, { headers });
  }
}
