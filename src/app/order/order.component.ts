import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
// import { HelperService } from '../helper.service';
import { MatStepper } from '@angular/material/stepper';
// import { timeout } from 'q';
import { Order } from 'src/datamodel/order';
// import { AuthService } from '../auth.service';
import { Size } from './test/test.component';
import { SharedService } from '../shared.service';
import { NeworderService } from '../services/neworder.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  encapsulation: ViewEncapsulation.None

})

export class OrderComponent implements OnInit {

  img: any;
  previewImg: any;
  hasImage = false;
  sizeParam: any;
  showPreview = false;
  selectedSize: Size;
  order: Order;
  x: any = -45;
  y: any = 45;
  z: any = 0;

  @ViewChild('stepper', { static: false }) _stepper: MatStepper


  constructor(
    // private routes: ActivatedRoute,
    // private helper: HelperService,
    private authSvc: AuthService,
    private sharedSvc: SharedService,
    private nos: NeworderService
  ) { }

  isloggedin() {
    return this.authSvc.loggedIn();
  }

  ngOnInit() {
    document.querySelector('mat-sidenav-content').scroll(0, 0);
    //   var qs = function(s) {
    //   return document.querySelector(s);
    //   },
    //   on = function(el, ev, fn) {
    //     qs(el).addEventListener(ev, fn);
    //   },
    //   x = qs('#x'),
    //   y = qs('#y'),
    //   z = qs('#z');

    // function showValue(range, display) {
    //   qs(display).value = qs(range).value;
    // }

    // function update() {
    //   var style = 'translateZ(' + z.value + 'px) rotateX(' + x.value + 'deg) rotateY(' + y.value + 'deg)';
    //   qs('#cube').style.transform = style;
    //   showValue('#x', '#x-val');
    //   showValue('#y', '#y-val');
    //   showValue('#z', '#z-val');
    // }

    // function random(min, max) {
    //   return Math.floor(min + Math.random() * (max - min + 1));
    // }

    // on('form', 'input', update);

    // // x.value = random(0, 360);
    // // y.value = random(0, 360);
    // // z.value = random(-400, 400);

    // update();
  }


  autoNext() {
    console.log(this._stepper);
    this._stepper.next();
  }

  imageSelected(ev: any) {
    // console.log('Image Selected');
    this.img = ev.file;
    this.sharedSvc.imgFile = ev.file;
    this.nos.File_original = ev.file;
    this.nos.Img_HTML_original = this.nos.Img_HTML_edited = ev.img;
    this.previewImg = ev.img;
    // // console.log(ev.file);
    // // console.log(ev.img);
    this.sizeParam = Object.assign({}, { 'height': ev.img.height, 'width': ev.img.width });
    this.hasImage = true;
  }

  checkImage(s: MatStepper) {
    setTimeout(() => {
      if (s.selectedIndex === 0) {
        location.reload();
      }
    }, 0);
    if (!this.img && s.selectedIndex === 0) {
      setTimeout(() => {
        alert('Please select a photo');
        s.selectedIndex = 0;
      }, 0);
    }
  };

  onSizeSelected(ev: any, stepper: MatStepper) {
    // // console.log(ev);
    this.selectedSize = ev.size;
    // this.showPreview=true;

    if (ev.selectedType === 'gallaryWrap') {
      this.selectedSize.customerSelected = 'gallaryWrap';
      this.order = {
        amount: ev.size.gallaryWrap,
        orderId: '',
        user: null,
        createdOn: Date.now(),
        productInfo: 'Gallary Wrap Order',
        size: ev.size
      };
      this.nos.newOrder = {
        orderId: '',
        customerId: '',
        delivery_address: [],
        email: '',
        fname: '',
        message: '',
        mobile: '',
        orderStatus: 'not placed',
        originalurl: 'original file not uploaded to server',
        url: 'edited file not uploaded to server',
        payment_mode: 'payumoney',
        pinfo: '',
        udf5: '',
        amount: ev.size.gallaryWrap,
        products: {
          type: 'Gallary Wrap',
          size: ev.size,
          corrections: [],
          wrapType: 'yet to selected'
        }
      };
      this.sharedSvc.order = this.order;
      this.showPreview = true;
      stepper.next();
    } else {
      this.selectedSize.customerSelected = 'rollCanvas';
      this.order = {
        amount: ev.size.rolledCanvas,
        user: null,
        createdOn: Date.now(),
        productInfo: 'rolledCanvas Order',
        size: ev.size
      }
      this.nos.newOrder = {
        orderId: '',
        customerId: '',
        delivery_address: [],
        email: '',
        fname: '',
        message: '',
        mobile: '',
        orderStatus: 'not placed',
        originalurl: 'original file not uploaded to server',
        url: 'edited file not uploaded to server',
        payment_mode: 'payumoney',
        pinfo: '',
        udf5: '',
        amount: ev.size.rolledCanvas,
        products: {
          type: 'Rolled Canvas',
          size: ev.size,
          corrections: [],
          wrapType: 'not applied'
        }
      };
      // // console.log(ev.size.rolledCanvas);
      // // console.log(this.nos.newOrder);
      this.sharedSvc.order = this.order;
      this.showPreview = true;
      stepper.next();
    }

  }

}
