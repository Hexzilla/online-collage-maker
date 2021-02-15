import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { HelperService } from '../helper.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  Popup: 'none' | 'mailPopup' | 'otpPopup' | 'passPopup' = 'none';
  otp: any;
  email: any;

  constructor(
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private helper: HelperService,
    private matIconRegistry: MatIconRegistry,
    private router: Router
  ) {
    this.matIconRegistry.addSvgIcon(
      'fblogo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/imgs/facebook.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/imgs/google.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'twitter',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/imgs/twitter.svg')
    );

    this.loginForm = fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(5), Validators.required]]
    });

  }

  ngOnInit() {
    document.querySelector('mat-sidenav-content').scroll(0, 0);
    if (this.authSvc.loggedIn()) {
      this.router.navigate(['/profile']);
    }
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    const data = this.loginForm.value;
    this.authSvc.authenticateUser(data);
    // this.authSvc.loginWithEmail(data.email,data.password).then(res=>{
    //   // console.log('login successful');
    // },err=>{
    //   // console.log('login failed');
    //   this.helper.showSnackbar('invalid email or password');
    // })
  }

  askForEmail() {
    this.Popup = 'mailPopup';
  }

  askForOTP() {
    const email: any = document.getElementById('fgtpassemail');
    const otp = this.generateOTP();
    this.otp = otp;
    this.email = email.value;
    if (email.value) {
      this.helper.showSnackbar('Sending OTP');
      this.authSvc.forgotPassword(otp, email.value)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.Popup = 'otpPopup';
            this.helper.showSnackbar('OTP Sent');
          } else {
            this.helper.showSnackbar(resp.msg);
          }
        }, err => {
          this.helper.showSnackbar(err.message);
        });
    }
  }

  askForNewPassword() {
    const uotp: any = document.getElementById('fgtotp');
    if (this.otp == uotp.value) {
      this.Popup = 'passPopup';
      this.helper.showSnackbar('OTP Verified');
    } else {
      this.helper.showSnackbar('Wrong OTP!');
    }
  }

  closePopup() {
    this.Popup = 'none';
  }

  generateOTP() {

    // Declare a digits variable  
    // which stores all digits 
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  updatePassword() {
    const newPassword: any = document.getElementById('newPassword');
    const cnfnewPassword: any = document.getElementById('cnfnewPassword');

    if (newPassword.value != cnfnewPassword.value) {
      return this.helper.showSnackbar("Password didn't match!");
    } else {
      this.helper.showSnackbar('Updating Password..');
      this.authSvc.updatePassword(this.email, newPassword.value)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.Popup = 'none';
            this.helper.showSnackbar(resp.msg);
          } else {
            this.helper.showSnackbar(resp.msg);
          }
        }, err => {
          this.helper.showSnackbar(err.message);
        });
    }
  }

}
