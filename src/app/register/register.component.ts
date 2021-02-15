import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HelperService } from '../helper.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  regForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private helper: HelperService,
    private auth: AuthService,
    private router: Router
  ) {
    this.regForm = fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(5)]],
      'cpassword': ['', [Validators.required, Validators.minLength(5)]],
      'firstname': ['', [Validators.required]],
      'lastname': ['', [Validators.required]],
      'mobile': ['']
    });
  }

  ngOnInit() {
    document.querySelector('mat-sidenav-content').scroll(0, 0);
    if (this.auth.loggedIn()) {
      history.back();
    }
  }

  register() {
    if (!this.regForm.valid) {
      this.helper.showSnackbar('Form is invalid');
      return false;
    } else {
      if (this.regForm.get('password').value === this.regForm.get('cpassword').value) {
        const data = this.regForm.value;
        this.auth.register(data);
        // this.auth.signUpWithEmail(data.email, data.password, data.firstname, data.lastname, data.mobile).then( r => {
        //   this.helper.showSnackbar('Account created successfully');
        //   this.router.navigate(['/home']);
        // }, err => {
        //   this.helper.showSnackbar('Error in creating account.please try again', 'OK', 5000);
        // });
      } else {
        this.helper.showSnackbar("Password doesn't match");
      }
    }
  }

}
