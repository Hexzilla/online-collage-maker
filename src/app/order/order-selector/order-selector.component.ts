import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from 'src/app/product.service';
import { Product, Pricing } from 'src/datamodel/product';


@Component({
  selector: 'app-order-selector',
  templateUrl: './order-selector.component.html',
  styleUrls: ['./order-selector.component.scss']
})
export class OrderSelectorComponent implements OnInit {

  priceList: Pricing[];
  title: string;
  selectedProduct: Product;

  @Output() onSizeSelected = new EventEmitter();
  constructor(private prdSvc: ProductService) {

  }

  ngOnInit() {
    // this.prdSvc.getAllProduct().subscribe((res:Product[])=>{
    //   this.priceList=res[0].pricing;
    //   this.selectedProduct=res[0];
    // })
  }

  onSelected(
    p: Pricing,
    s: string
  ) {
    this.onSizeSelected.emit({ pricing: p, selectionType: s });

  }

}
