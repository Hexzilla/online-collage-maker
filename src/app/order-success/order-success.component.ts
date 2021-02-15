import { Component, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // import Router and NavigationEnd
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';

// declare ga as a function to set and sent the events
declare let ga: Function;
declare var gtag;

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss'],
})
export class OrderSuccessComponent implements OnInit {
  successText = 'Loading...';

  constructor(public router: Router, @Inject(DOCUMENT) private doc: Document) {
    const orderTitle = localStorage.getItem('orderTitle');
    const successAmount = localStorage.getItem('successAmount');
    const successId = localStorage.getItem('successId');
    const shipping = localStorage.getItem('shipping');
    const tax = localStorage.getItem('tax');
    const coupon = localStorage.getItem('coupon');
    const affiliation = localStorage.getItem('affiliation');
    const paymentStatus = localStorage.getItem('paymentStatus');

    if (successAmount) {
      ga('require', 'ecommerce');
      ga('ecommerce:addItem', {
        id: successId,
        name: orderTitle,
        sku: 'DD23444',
        category: 'Canvas Print',
        price: successAmount,
        quantity: '1',
        currency: 'INR', // local currency code.
      });
      // ga('ecommerce:send');
      ga('ecommerce:addTransaction', {
        // Transaction details are provided in an actionFieldObject.
        id: successId, // (Required) Transaction id (string).
        affiliation, // Affiliation (string).
        revenue: successAmount, // Revenue (number).
        tax, // Tax (number).
        shipping,
      });

      ga('ec:setAction', 'purchase', {
        // Transaction details are provided in an actionFieldObject.
        id: successId, // (Required) Transaction id (string).
        affiliation: affiliation, // Affiliation (string).
        revenue: successAmount, // Revenue (number).
        tax: tax, // Tax (number).
        shipping: shipping, // Shipping (number).
        coupon: coupon, // Transaction coupon (string).
      });
      ga('ecommerce:send');
      this.successText = 'Your Order initiated successfully.' + `(Status: ${paymentStatus})`;
      localStorage.removeItem('successAmount');
      localStorage.removeItem('successId');
      localStorage.removeItem('coupon');
      localStorage.removeItem('tax');
      localStorage.removeItem('shipping');
      localStorage.removeItem('affiliation');
    } else {
      this.successText = 'Your Order initiated successfully.' + `(Status: ${paymentStatus})`;
    }
    // const script: HTMLScriptElement = this.doc.createElement('script');
    // script.setAttribute('id', 'gtagconversion');
    // script.setAttribute('src', 'assets/js/gtagconversion.js');
    // this.doc.body.appendChild(script);
    // const script2: HTMLScriptElement = this.doc.createElement('script');
    // script2.setAttribute('id', 'gtagconversionvalue');
    // script2.setAttribute('src', 'assets/js/gtagconversionvalue.js');
    // this.doc.body.appendChild(script2);

    // subscribe to router events and send page views to Google Analytics
    // this.router.events.subscribe(event => {

    //   if (event instanceof NavigationEnd) {
    //     ga('set', 'page', event.urlAfterRedirects);
    //     ga('send', 'pageview');
    //   }

    // });
    // const navEndEvents = router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    // );
    // navEndEvents.subscribe((event: NavigationEnd) => {
    //   // const page_path = event.urlAfterRedirects;
    //   // gtag('config', 'UA-52889646-1', {
    //   //   'page_path': page_path
    //   // });
    //   gtag('config', 'AW-967151556');
    //   gtag('event', 'conversion', {
    //     'send_to': 'AW-967151556/t5_kCMb7w7UBEMSfls0D',
    //     'value': 12.0,
    //     'currency': 'INR',
    //     'transaction_id': 'print-1234'
    //   });
    // });
  }

  ngOnInit() {
    document.querySelector('mat-sidenav-content').scroll(0, 0);
  }
}
