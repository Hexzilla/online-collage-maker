import { Component, OnInit } from '@angular/core';
import { Product } from 'src/datamodel/product';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {

  constructor(
    // private afs:AngularFirestore
  ) { }

  ngOnInit() {
    this.saveProduct();
  }

  saveProduct() {
    const list: Product = {
      id: 'canvas', name: 'Canvas Print', pricing: [
        { height: 8, width: 8, rolledRate: 279, wrappedRate: 439 },
        { height: 8, width: 10, rolledRate: 279, wrappedRate: 439 },
        { height: 8, width: 12, rolledRate: 279, wrappedRate: 439 },
        { height: 10, width: 10, rolledRate: 279, wrappedRate: 439 },
        { height: 10, width: 20, rolledRate: 439, wrappedRate: 439 },
        { height: 12, width: 12, rolledRate: 319, wrappedRate: 439 },
        { height: 12, width: 18, rolledRate: 519, wrappedRate: 439 },
        { height: 12, width: 20, rolledRate: 639, wrappedRate: 439 },
        { height: 12, width: 24, rolledRate: 639, wrappedRate: 439 },
        { height: 12, width: 36, rolledRate: 799, wrappedRate: 439 },
        { height: 16, width: 16, rolledRate: 719, wrappedRate: 439 },
        { height: 16, width: 24, rolledRate: 759, wrappedRate: 439 },
        { height: 16, width: 32, rolledRate: 919, wrappedRate: 439 },
        { height: 18, width: 18, rolledRate: 759, wrappedRate: 439 },
        { height: 18, width: 24, rolledRate: 839, wrappedRate: 439 },
        { height: 18, width: 30, rolledRate: 999, wrappedRate: 439 },
        { height: 18, width: 36, rolledRate: 1159, wrappedRate: 439 },
        { height: 20, width: 20, rolledRate: 759, wrappedRate: 439 },
        { height: 20, width: 30, rolledRate: 1079, wrappedRate: 439 },
        { height: 20, width: 40, rolledRate: 1399, wrappedRate: 439 },
        { height: 24, width: 24, rolledRate: 1079, wrappedRate: 439 },
        { height: 24, width: 30, rolledRate: 1239, wrappedRate: 439 },
        { height: 24, width: 36, rolledRate: 1479, wrappedRate: 439 },
        { height: 24, width: 48, rolledRate: 1919, wrappedRate: 439 },
        { height: 26, width: 32, rolledRate: 1439, wrappedRate: 439 },
        { height: 30, width: 30, rolledRate: 1519, wrappedRate: 439 },
        { height: 30, width: 45, rolledRate: 2199, wrappedRate: 439 },
        { height: 30, width: 60, rolledRate: 2879, wrappedRate: 439 },
        { height: 30, width: 60, rolledRate: 2479, wrappedRate: 439 },
        { height: 32, width: 60, rolledRate: 2199, wrappedRate: 439 },
        { height: 32, width: 48, rolledRate: 2439, wrappedRate: 439 },
        { height: 36, width: 36, rolledRate: 2759, wrappedRate: 439 },
        { height: 36, width: 42, rolledRate: 3399, wrappedRate: 439 },
        { height: 36, width: 48, rolledRate: 275, wrappedRate: 439 },
        { height: 36, width: 60, rolledRate: 3399, wrappedRate: 439 },
        { height: 36, width: 72, rolledRate: 3999, wrappedRate: 439 },
        { height: 42, width: 48, rolledRate: 3159, wrappedRate: 439 },
        { height: 42, width: 60, rolledRate: 3919, wrappedRate: 439 },
        { height: 42, width: 70, rolledRate: 4639, wrappedRate: 439 },
        { height: 48, width: 72, rolledRate: 4799, wrappedRate: 439 },
        { height: 50, width: 84, rolledRate: 6319, wrappedRate: 439 },
        { height: 50, width: 90, rolledRate: 5439, wrappedRate: 0 },
      ]
    };
    // console.log(list.pricing.length);

    // this.afs.collection('products').add(list).then(r => {
    //   // console.log('product saved ')
    // }, err => {
    //   // console.log(err);
    // })
  }

}
