import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from "../auth.service";
//import { ToastrService } from 'ngx-toastr';
//import { ApiService } from '../api/api'
import { Collage } from '../collage/collage'

@Component({
  selector: "collage-make",
  templateUrl: "collage-make.component.html",
  styleUrls: ["collage-make.component.scss"],
})
export class CollageMakeComponent implements OnInit {
  public selectedImageUrl: string = null;
  public loading: boolean = false;

  constructor(
    private http: HttpClient,
    private authSvc: AuthService,
    private router: Router,
    //private toastr: ToastrService,
    //private api: ApiService,    
    private collage: Collage
  ) {}

  async ngOnInit() {
    this.collage.onSelectedImageUrl = (url) => this.selectedImageUrl = url
    this.collage.onLoadingStateChanged = (state) => this.loading = state

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    if (!this.loggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }
}
