import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api/api'
import { Collage } from "../collage/collage";

@Component({
  selector: "collage-template",
  templateUrl: "collage-template.component.html",
  styleUrls: ["collage-template.component.scss"],
})
export class CollageTemplateComponent implements OnInit {
  public selectedImageUrl: string = null;
  public loading: boolean = false;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private api: ApiService,
    private collage: Collage
  ) {}

  async ngOnInit() {
    this.collage.onSelectedImageUrl = (url) => (this.selectedImageUrl = url);
    this.collage.onLoadingStateChanged = (state) => (this.loading = state);

    document.addEventListener("contextmenu", (event) => event.preventDefault());
  }
}
