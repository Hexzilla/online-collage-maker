import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { Order } from 'src/datamodel/order';
import { OrderService } from '../order.service';
import { HelperService } from '../helper.service';
import { NewOrder } from 'src/datamodel/newOrder';
import { NeworderService } from '../services/neworder.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { DOCUMENT } from '@angular/common';
import * as _ from 'lodash';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  order: Order;
  newOrders: NewOrder[];
  addr = {
    name: '',
    email: '',
    mobile: '',
    street: '',
    city: '',
    pincode: '',
    state: '',
    imgsrc: '',
  };
  billingaddr = {
    name: '',
    email: '',
    mobile: '',
    street: '',
    city: '',
    pincode: '',
    state: '',
    imgsrc: '',
  };
  emptybillingaddr = {
    name: '',
    email: '',
    mobile: '',
    street: '',
    city: '',
    pincode: '',
    state: '',
    imgsrc: '',
  };
  wrapType: string;
  actualAmount = 0;
  extraAmount = 0;
  extraChanges = [];
  extraChangesValues = [
    {
      name: 'Red Eye',
      price: 100,
    },
    {
      name: 'Date Stamp',
      price: 100,
    },
    {
      name: 'Dust / Scratch Removal',
      price: 150,
    },
    {
      name: 'Lighten/Darken Image',
      price: 25,
    },
    {
      name: 'Enhance color',
      price: 35,
    },
    // TODO: Make Custom Price Dynamic
    // {
    //   name: 'Shipping 3-5 days',
    //   price: ((totalAmount * 8.5) / 100)
    // }
  ];
  cpBa: any = true;
  redEye: boolean;
  dateStamp: boolean;
  dustScratchRemoval: boolean;
  lightenDarkenImage: boolean;
  enhanceColor: boolean;
  discountApplied = false;
  discount = '';
  amount: any = 0;
  totalAmount: any = '';
  environment: any;
  coupon = '';
  original_amount: any;
  discount_amount: any;
  shippingApplied = false;
  shippingAmount = 100;
  orderCategories = [
    {
      name: 'Canvas Prints',
      types: ['Rolled Canvas', 'Gallary Wrap'],
      orders: [],
      coupen: 'love',
      coupenDiscount: '40',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
    {
      name: 'Photo Prints',
      types: ['PhotoPrint', 'HiResolutionPhotoPrint'],
      orders: [],
      coupen: 'love',
      coupenDiscount: '20',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
    {
      name: 'Poster Prints',
      types: ['PosterPrint', 'HiResolutionPosterPrint'],
      orders: [],
      coupen: 'love',
      coupenDiscount: '20',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
    {
      name: 'Vinyl Prints',
      types: ['VinylPrint', 'HiResolutionVinylPrint'],
      orders: [],
      coupen: 'love',
      coupenDiscount: '20',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
    {
      name: 'Banner Prints',
      types: ['BannerPrint', 'HiResolutionBannerPrint'],
      orders: [],
      coupen: 'love',
      coupenDiscount: '20',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
    {
      name: 'Single Product',
      types: ['Single Product'],
      orders: [],
      coupen: 'first',
      coupenDiscount: '10',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
  ];
  defaultOrderCategories = [
    {
      name: 'Canvas Prints',
      types: ['Rolled Canvas', 'Gallary Wrap'],
      orders: [],
      coupen: 'love',
      Buy1Get1coupen: 'BUY1GET1',
      coupenDiscount: '40',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
    {
      name: 'Photo Prints',
      types: ['PhotoPrint', 'HiResolutionPhotoPrint'],
      orders: [],
      coupen: 'love',
      coupenDiscount: '20',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
    {
      name: 'Poster Prints',
      types: ['PosterPrint', 'HiResolutionPosterPrint'],
      orders: [],
      coupen: 'love',
      coupenDiscount: '20',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
    {
      name: 'Vinyl Prints',
      types: ['VinylPrint', 'HiResolutionVinylPrint'],
      orders: [],
      coupen: 'love',
      coupenDiscount: '20',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
    {
      name: 'Banner Prints',
      types: ['BannerPrint', 'HiResolutionBannerPrint'],
      orders: [],
      coupen: 'love',
      coupenDiscount: '20',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
    {
      name: 'Single Product',
      types: ['Single Product'],
      orders: [],
      coupen: 'first',
      coupenDiscount: '10',
      shipping: '100',
      shippingFreeAmount: '300',
      original_amount: 0,
      discount_amount: 0,
      amount: 0,
      totalAmount: '',
      discountApplied: false,
    },
  ];
  shippingType: 'Free' | 'Paid' = 'Free';
  witoutShippingAmount = 0;

  note = '';
  buy1get1discountApplied = false;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private router: Router,
    private sharedSvc: SharedService,
    private orderSvc: OrderService,
    private helper: HelperService,
    private nos: NeworderService,
    private as: AuthService
  ) {
    this.as.getProfile().subscribe(
      (resp: any) => {
        if (resp.success) {
          // console.log(resp);
        } else {
          this.helper.showSnackbar(resp.msg);
        }
      },
      (err) => {
        this.helper.showSnackbar(err.message);
      }
    );

    this.newOrders = this.nos.newOrders;
    this.filterOrders();
    // // console.log(this.nos.newOrders);
    // this.getAmount();
    this.environment = environment;
    if (this.sharedSvc.order) {
      this.order = this.sharedSvc.order;
      this.actualAmount = this.order.amount;
      if (this.order.amount === this.order.size.gallaryWrap) {
        this.wrapType = 'Gallary Wrap';
      } else {
        this.wrapType = 'Rolled Canvas';
      }
    }
  }

  filterOrders() {
    this.discountApplied = false;
    this.orderCategories = this.defaultOrderCategories;
    for (const cat of this.orderCategories) {
      cat.orders = [];
      for (const newOrder of this.newOrders) {
        for (const type of cat.types) {
          if (newOrder.products.type === type) {
            cat.orders.push(newOrder);
          }
        }
      }
    }
    for (const oc of this.orderCategories) {
      oc.orders = _.sortBy(oc.orders, 'amount');
    }
    console.log('orders Filtered');
    this.getAmount();
    this.newOrders = this.newOrders.map((o: any) => {
      if (o.oldamount) {
        o.amount = o.oldamount;
      }
      return o;
    });
    this.getAmount();
    setTimeout(() => {
      this.getAmount();
    }, 1000);
    // console.log(this.orderCategories);
  }

  getAmount() {
    this.newOrders = [];
    for (const oc of this.orderCategories) {
      oc.amount = 0;
      for (const item of oc.orders) {
        oc.amount += item.amount;
        this.newOrders.push(item);
      }
    }
    this.amount = 0;
    for (const item of this.newOrders) {
      this.amount += item.amount;
    }
    this.getTotalAmount();
  }

  isString(variable: any) {
    if (typeof variable === 'string') {
      return true;
    } else {
      return false;
    }
  }

  getTotalAmount() {
    for (const oc of this.orderCategories) {
      oc.totalAmount = (oc.amount + oc.amount * 0.12).toFixed(2);
    }
    this.original_amount = 0;
    this.discount_amount = 0;
    this.amount = 0;
    this.totalAmount = 0;
    for (const oc of this.orderCategories) {
      this.original_amount += oc.original_amount;
      this.discount_amount += oc.discount_amount;
      this.amount += oc.amount;
      this.totalAmount += parseFloat(oc.totalAmount);
    }
    this.witoutShippingAmount = this.totalAmount;
    if (this.shippingType == 'Paid') {
      this.shippingApplied = true;
      this.totalAmount = this.totalAmount + this.getPaidShippingAmount();
    } else if (this.totalAmount < 300) {
      this.shippingApplied = true;
      this.totalAmount = this.totalAmount + this.shippingAmount;
    } else {
      this.shippingApplied = false;
    }
    this.totalAmount = this.totalAmount.toFixed(2);
  }

  getPaidShippingAmount() {
    // const paidAmt =  (this.witoutShippingAmount * 8.5) / 100;
    const paidAmt = (this.witoutShippingAmount * 20) / 100;
    if (paidAmt < 100) {
      return 100;
    } else {
      return paidAmt;
    }
  }

  applyPromo(name) {
    if (this.coupon.match(new RegExp('love', 'i'))) {
      for (const oc of this.orderCategories) {
        if (oc.name === name) {
          if (
            confirm(
              `Your amount after discount will be: ${(
                oc.amount -
                oc.amount * (parseInt(oc.coupenDiscount) / 100)
              ).toFixed(2)}. Place Your Order?`
            )
          ) {
            oc.original_amount = oc.amount;
            oc.discount_amount =
              oc.amount * (parseInt(oc.coupenDiscount) / 100);
            oc.amount =
              oc.amount - oc.amount * (parseInt(oc.coupenDiscount) / 100);
            oc.discountApplied = true;
            this.discountApplied = true;
            this.discount += `${oc.coupenDiscount} percent discount`;
            this.getTotalAmount();
            // setTimeout(() => {
            //   this.makePayment();
            // }, 500);
          }
        }
      }
    } else if (this.coupon.match(new RegExp('buy1get1', 'i'))) {
      this.helper.showSnackbar('BUY1GET1 Offer Applied');
      for (const oc of this.orderCategories) {
        if (oc.name === 'Canvas Prints') {
          if (oc.orders.length >= 2) {
            oc.orders = _.sortBy(oc.orders, 'amount');
            // oc.orders = oc.orders.reverse();
            for (let i = 0; i < Math.floor(oc.orders.length / 2); i++) {
              oc.orders[i].oldamount = oc.orders[i].amount;
              oc.orders[i].amount = 0;
              oc.orders[i].free = true;
            }
            this.buy1get1discountApplied = true;
            this.getAmount();
          } else {
            this.helper.showSnackbar(
              'Promo Code only applicable for minimum two orders of "Canvas Prints"'
            );
            this.coupon = '';
          }
        }
      }
    } else {
      this.helper.showSnackbar('No coupon with this code found');
      this.coupon = '';
    }
  }

  removeOrder(orderId: any) {
    if (confirm('Do you really want to delete this order?')) {
      this.newOrders = this.newOrders.filter((o) => o.orderId !== orderId);
      this.newOrders = this.newOrders.map((o: any) => {
        if (o.oldamount) {
          o.amount = o.oldamount;
        }
        return o;
      });
      this.buy1get1discountApplied = false;
      this.nos.newOrders = this.newOrders;
      localStorage.setItem('newOrders', JSON.stringify(this.newOrders));
      for (const oc of this.orderCategories) {
        oc.discountApplied = false;
      }
      this.discountApplied = false;
      this.buy1get1discountApplied = false;
      this.filterOrders();
      // this.getAmount();
      // this.filterOrders();
    }
  }

  recalculateAmount() {
    let am = 0;
    for (const ec of this.extraChanges) {
      am += ec.price;
    }
    this.extraAmount = am;
  }

  isSelected(ec, arrray) {
    let found = false;
    for (const exc of arrray) {
      if (exc.name === ec.name) {
        found = true;
      }
    }
    return found;
  }

  selectEc(ec, item) {
    // console.log('extra changes selected');
    let corramt = 0;
    if (!item.tempPrice) {
      item.tempPrice = item.amount;
    }
    if (!this.isSelected(ec, item.products.corrections)) {
      item.products.corrections.push(ec);
    } else {
      item.products.corrections = item.products.corrections.filter(
        (exc) => exc.name !== ec.name
      );
    }
    for (const corr of item.products.corrections) {
      corramt += parseInt(corr.price);
    }
    item.amount = parseInt(item.tempPrice) + corramt;
    this.getAmount();
    for (const oc of this.orderCategories) {
      oc.discountApplied = false;
    }
    this.discountApplied = false;
    // console.log(this.orderCategories);
    // this.recalculateAmount();
  }

  copyToBillingAddress() {
    if (this.cpBa) {
      this.addr = this.billingaddr;
    } else {
      this.addr = this.emptybillingaddr;
    }
    this.cpBa = !this.cpBa;
  }

  ngOnInit() {
    document.querySelector('mat-sidenav-content').scroll(0, 0);
    this.setBoltScript();
  }

  setBoltScript() {
    var Scripts: any = this.doc.getElementsByTagName('script');
    var Script_Remove = false;
    for (var i = 0; i < Scripts.length; i++) {
      if (Scripts[i].attributes.id) {
        if (Scripts[i].attributes.id.value == 'bolt') {
          Scripts[i].remove();
          Script_Remove = true;
        }
      }
    }

    if (!Script_Remove) {
      let script: HTMLScriptElement = this.doc.createElement('script');
      script.setAttribute('id', 'bolt');
      script.setAttribute(
        'src',
        'https://checkout-static.citruspay.com/bolt/run/bolt.min.js'
      );
      script.setAttribute('bolt-color', '000000');
      script.setAttribute(
        'bolt-logo',
        'https://m.printposters.in/canvas-prints/assets/imgs/logo_3.jpg'
      );
      this.doc.head.appendChild(script);
    } else {
      let script: HTMLScriptElement = this.doc.createElement('script');
      script.setAttribute('id', 'bolt');
      script.setAttribute(
        'src',
        'https://checkout-static.citruspay.com/bolt/run/bolt.min.js'
      );
      script.setAttribute('bolt-color', '000000');
      script.setAttribute(
        'bolt-logo',
        'https://m.printposters.in/canvas-prints/assets/imgs/logo_3.jpg'
      );
      this.doc.head.appendChild(script);
    }
  }

  goToOrder(orderType) {
    switch (orderType) {
      case 'cp':
        this.router.navigateByUrl('order');
        break;

      case 'pp':
        this.router.navigateByUrl(
          'https://m.printposters.in/photo-prints/order'
        );
        break;

      case 'pop':
        this.router.navigateByUrl(
          'https://m.printposters.in/poster-prints/order'
        );
        break;

      case 'vp':
        this.router.navigateByUrl(
          'https://m.printposters.in/vinyl-prints/order'
        );
        break;

      case 'bp':
        this.router.navigateByUrl(
          'https://m.printposters.in/banner-prints/order'
        );
        break;
    }
  }

  makePayment1() {
    this.orderSvc.createOrder(this.order).then(
      (res) => {
        this.helper.showSnackbar(
          'thank you for order. your order has been created.'
        );
      },
      (err) => {
        // console.log(err);
      }
    );
  }

  makePayment() {
    // console.log(this.order, this.totalAmount, this.discount);
    // console.log(this.addr);
    // console.log(this.billingaddr);
    if (
      this.totalAmount &&
      this.addr.name &&
      this.addr.email &&
      this.addr.mobile &&
      this.addr.pincode &&
      this.addr.state &&
      this.addr.city &&
      this.addr.street &&
      this.billingaddr.name &&
      this.billingaddr.email &&
      this.billingaddr.mobile &&
      this.billingaddr.pincode &&
      this.billingaddr.state &&
      this.billingaddr.city &&
      this.billingaddr.street
    ) {
      localStorage.setItem('tax', (this.amount * 0.12).toString());
      localStorage.setItem('shipping', this.shippingAmount.toString());
      localStorage.setItem('coupon', 'LOVE');
      localStorage.setItem('affiliation', 'Printposters - Online');
      let orderTitle = '';
      for (const oc of this.orderCategories) {
        if (oc.orders.length) {
          if (orderTitle) {
            orderTitle += ',';
          }
          orderTitle += oc.name;
        }
      }
      localStorage.setItem('orderTitle', orderTitle);
      // const uorder = {
      //   note: this.note,
      // };
      if (!this.shippingApplied) {
        this.orderSvc.payment(this.order, 0, this.totalAmount, this.discount, [
          { shippingaddr: this.addr, billingaddr: this.billingaddr },
        ]);
      } else if (this.shippingType == 'Free') {
        this.orderSvc.payment(
          this.note,
          this.shippingAmount,
          this.totalAmount,
          this.discount,
          [{ shippingaddr: this.addr, billingaddr: this.billingaddr }]
        );
      } else {
        this.orderSvc.payment(
          this.note,
          this.getPaidShippingAmount(),
          this.totalAmount,
          this.discount,
          [{ shippingaddr: this.addr, billingaddr: this.billingaddr }]
        );
      }
    } else {
      this.helper.showSnackbar('Please Fill All The Neccesary Details Above.');
    }
  }
}
