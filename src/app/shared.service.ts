import { Injectable } from '@angular/core';
import { Order } from 'src/datamodel/order';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  img: any;
  imgFile: any;
  order: Order;
  ratioWidth: any;
  ratioHeight: any;
  maintainAspectRatio = true;
  cropHeight: any;
  cropWidth: any;
  constructor() {
  }

}
