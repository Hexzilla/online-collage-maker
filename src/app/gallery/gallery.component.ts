import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { HelperService } from '../helper.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  product: any;
  env: any;

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private hs: HelperService,
    private router: Router
  ) {
    this.env = environment;
    this.route.params.subscribe(param => {
      this.ps.getGalleryProductBySlug(param.slug)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.product = resp.categories;
          } else {
            this.hs.showSnackbar(resp.msg);
          }
        }, err => {
          this.hs.showSnackbar(err.message);
        });
    });
  }

  ngOnInit() {
  }

}
