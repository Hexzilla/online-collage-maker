import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogRef } from '@angular/material/dialog';
import { HelperService } from 'src/app/helper.service';
import { UserService } from 'src/app/user.service';
import { SharedService } from 'src/app/shared.service';
import { OrderService } from 'src/app/order.service';
import { AuthService } from 'src/app/auth.service';
import { Size } from '../test/test.component';
import { Order } from 'src/datamodel/order';
import { Router } from '@angular/router';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import * as _ from 'lodash';

import { MatIconRegistry } from "@angular/material/icon";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DomSanitizer } from '@angular/platform-browser';
import { NeworderService } from 'src/app/services/neworder.service';
import { FileService } from 'src/app/services/file.service';
import { HttpEventType } from '@angular/common/http';

interface Display {
  square?: boolean;
  potrait?: boolean;
  landscape?: boolean;
}
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  amount = 0;
  uploadProgress = -1;
  private _img: any;
  private _size: Size;
  display: Display = {
    landscape: false,
    potrait: false,
    square: false,
  };
  isize: any;
  height: any;
  width: any;
  heightV: any;
  widthV: any;
  ratio: any;
  gallaryWrap: boolean = false;
  selectedWrap: any;
  borderTop: any;
  borderBottom: any;
  borderRight: any;
  borderLeft: any;
  previewColor: any;
  canvasImg: any;
  user: any;
  aspectRatio: any;
  x: any;
  y: any;
  z: any;
  qs: any;
  on: any;

  constructor(
    public dialog: MatDialog,
    private helper: HelperService,
    private router: Router,
    private userSvc: UserService,
    private sharedSvc: SharedService,
    private orderSvc: OrderService,
    private authService: AuthService,
    private nos: NeworderService,
    private fs: FileService,
    @Inject(DOCUMENT) document) {
    if (this.sharedSvc.order) {
      this.amount = this.sharedSvc.order.amount
    }
  }

  openDialog() {
    this.authService.setimgsrc(this.imgsrc);
    const dialogRef = this.dialog.open(PreviewDialog);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }



  @Input()
  set imgsrc(val) {
    // this._img = val;
    this._img = this.sharedSvc.img;
  }

  get imgsrc() {
    return this.sharedSvc.img;
  }

  ngOnInit() {
    document.querySelector('mat-sidenav-content').scroll(0, 0);
    this.qs = function (s) {
      return document.querySelector(s);
    },
      this.on = function (el, ev, fn) {
        this.qs(el).addEventListener(ev, fn);
      },
      this.x = this.qs('#x'),
      this.y = this.qs('#y'),
      this.z = this.qs('#z');

    this.on('form', 'input', this.update);

    this.x.value = 0;
    this.y.value = 20;
    this.z.value = 0;

    this.update();
  }

  showValue(range, display) {
    this.qs(display).value = this.qs(range).value;
  }
  update() {
    // console.log('update running...');
    const style = 'translateZ(' + this.z.value + 'px) rotateX(' + this.x.value + 'deg) rotateY(' + this.y.value + 'deg)';
    this.qs('#cube').style.transform = style;
    this.showValue('#x', '#x-val');
    this.showValue('#y', '#y-val');
    this.showValue('#z', '#z-val');
  }
  random(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  @Input()
  set size(size) {
    this._size = size;
    this.aspectRatio = this._size.fixedSize / this._size.recommendedSize;
    this.isize = this._size.fixedSize + ' X ' + this._size.recommendedSize;
    // console.log(this.aspectRatio);
    if (this.size) {
      if (this.size.customerSelected == 'gallaryWrap') {
        // console.log('gallary wrap');
        this.gallaryWrap = true;
        this.selectedWrap = 'gallaryWrap';
      } else {
        // console.log('canvas roll wrap');
        this.gallaryWrap = false;
      }
      this.setPreview();
      this.amount = this.sharedSvc.order.amount;
    }
  }

  get size() {
    return this._size;
  }


  setPreview() {
    // console.log(this.size);
    if (this.sharedSvc.cropHeight && this.sharedSvc.cropHeight) {
      this._img.height = this.sharedSvc.cropHeight;
      this._img.width = this.sharedSvc.cropWidth;
    }
    // console.log('height: ' + this._img.height);
    // console.log('width: ' + this._img.width);

    if (this._img.height > this._img.width) {
      this.ratio = this._img.height / this._img.width;
    } else {
      this.ratio = this._img.width / this._img.height;
    }
    _.ceil(this.ratio, 2);

    //condition 1 - when fixedSize (height) is less then recommendedSize (width) - landscape size
    let h: number = 200;
    let w: number = 200;

    if (this.size.fixedSize != this.size.recommendedSize) {

      if (this._img.height < this._img.width) {
        this.height = (this.size.fixedSize * 10) + "px";
        this.width = (this.size.recommendedSize * 10) + "px";
        this.heightV = 150;
        this.widthV = 150 * this.ratio;
        // this.widthV = 150 * (this.sharedSvc.img.width / this.sharedSvc.img.height);
        this.display.landscape = true;
        this.display.potrait = false;
        this.display.square = false;

      } else if (this._img.height > this._img.width) //condition 2: potrait mode screen
      {
        h = 300;
        w = 200;
        this.display.landscape = false;
        this.display.potrait = true;
        this.display.square = false;

        if (this.size.fixedSize <= 20) {
          this.height = (h - ((h * 10) / 100)) + "px";
          this.width = (w - ((w * 10) / 100)) + "px";
          this.heightV = 230 * this.ratio;
          this.widthV = 230;
        }
        if (this.size.fixedSize > 20) {
          this.height = (h + ((h * 10) / 100)) + "px";
          this.width = (w + ((w * 10) / 100)) + "px";
          this.heightV = 250 * this.ratio;
          this.widthV = 250;
        }

        this.display.landscape = false;
        this.display.potrait = true;
        this.display.square = false;

      }
    } else if (this.size.fixedSize === this.size.recommendedSize) {
      this.height = "200px";
      this.width = "200px";
      this.heightV = 170;
      this.widthV = 170;
      this.display.landscape = false;
      this.display.potrait = false;
      this.display.square = true;
    }
    // this.heightV = _.ceil(this.heightV);
    // this.widthV = _.ceil(this.widthV);
    // console.log('widthV, heightV');
    // console.log(this.widthV, this.heightV);

    const right: any = document.querySelector('.right');
    const left: any = document.querySelector('.left');
    const top: any = document.querySelector('.top');
    const bottom: any = document.querySelector('.bottom');
    const front: any = document.querySelector('.front');

    // // console.log(right);
    right.style.transform = `rotateY(-90deg) translateZ(-${this.widthV / 2}px)`;
    // // console.log(right);
    left.style.transform = `rotateY(90deg) translateZ(-${this.widthV / 2}px)`;
    // // console.log(right);
    top.style.transform = `rotateX(-90deg) translateZ(-${this.heightV / 2}px) translateY(${(this.heightV / 2) - (this.widthV / 2)}px)`;
    // // console.log(right);
    bottom.style.transform = `rotateX(90deg) translateZ(-${this.heightV / 2}px) translateY(${-((this.heightV / 2) - (this.widthV / 2))}px)`;
    // // console.log(right);
    front.style.transform = `rotateX(0deg) translateZ(${this.widthV / 2}px)`;
    // const back: any = document.querySelector('.back')
    // // // console.log(right);
    // back.style.transform = `rotateX(0deg) translateZ(-${this.heightV / 2}px)`;

    left.style.textAlign = 'initial';
    right.style.textAlign = 'initial';
    top.style.textAlign = 'initial';
    bottom.style.textAlign = 'initial';

  }




  showEdit() {
  }

  // makePayment1() {
  //   if (this.authService.fbUser) {
  //     this.userSvc.getCurrentUser(this.authService.fbUser.uid).subscribe(r => {
  //       const order: Order = {
  //         amount: this._size.rolledCanvas,
  //         createdOn: Date.now(),
  //         productInfo: '',
  //         size: this._size,
  //         user: r,
  //         selectedWrap: this.selectedWrap,
  //         previewColor: this.previewColor
  //       };
  //       this.sharedSvc.order = order;
  //       this.router.navigate(['cart']);

  //       // this.orderSvc.createOrder(order).then((res)=>{

  //       //   this.helper.showSnackbar('thank you for making payment . your order has been created.');

  //       // },err=>{
  //       //   // console.log(err);
  //       // });
  //     });


  //   } else {
  //     this.helper.showSnackbar('You are not logged In. please login to save your order and make payment');
  //   }
  // }

  addToCart() {
    this.uploadProgress = 0;
    document.getElementById('img-button').innerText = `Image uploading : ${0} % `;
    // if (this.authService.loggedIn()) {
    // this.authService.getProfile().subscribe((res: any) => {
    //   if (res.success) {
    this.nos.newOrder.products.wrapType = this.selectedWrap;
    if (this.selectedWrap === 'colorWrap') {
      this.nos.newOrder.products.color = this.previewColor;
    }
    this.nos.newOrder.customerId = JSON.parse(localStorage.getItem('user')).id;
    this.nos.newOrder.email = JSON.parse(localStorage.getItem('user')).email;
    this.nos.newOrder.fname = JSON.parse(localStorage.getItem('user')).name;
    this.nos.newOrder.orderId = Date.now();
    this.nos.newOrder.orderStatus = 'Pending';
    this.nos.newOrder.originalurl = this.nos.Img_HTML_original;
    this.nos.newOrder.url = this.nos.Img_HTML_edited;
    this.nos.newOrder.payment_mode = 'PayUMoney';
    this.nos.newOrder.pinfo = '';
    this.nos.newOrder.products.corrections = [];

    this.fs.uploadFile(this.nos.File_original).subscribe((event: any) => {
      console.log(event);
      console.log(event.type);
      if (event.type === HttpEventType.UploadProgress) {
        const uploadProgress = Math.round((event.loaded / event.total * 100));
        console.log(uploadProgress);
        this.uploadProgress = uploadProgress;
        document.getElementById('img-button').innerText = `Image uploading : ${uploadProgress} % `;
      } else if (event.type === HttpEventType.Response) {
        const resp: any = event;
        // // console.log(resp);
        this.nos.newOrder.originalurl = resp.body.uploadname;
        if (this.nos.File_edited) {
          this.fs.uploadFile(this.nos.File_edited).subscribe((event2: any) => {
            if (event2.type === HttpEventType.UploadProgress) {
              const uploadProgress = Math.round((event2.loaded / event2.total * 100));
              this.uploadProgress = uploadProgress;
              document.getElementById('img-button').innerText = `(Cropped) uploading : ${uploadProgress} % `;

            } else if (event2.type === HttpEventType.Response) {
              const resp2: any = event2;
              // // console.log(resp2);
              this.nos.newOrder.url = resp2.body.uploadname;
              // // console.log(this.nos.newOrder);
              this.nos.newOrders.push(this.nos.newOrder);
              localStorage.setItem('newOrders', JSON.stringify(this.nos.newOrders));
              setTimeout(() => {
                window.location.href = 'https://m.printposters.in/canvas-prints/cart';
              }, 1000);
            }
          }, err => {
            this.uploadProgress = 0;
            document.getElementById('img-button').innerText = `Add To Cart`;
            // console.log(err);
            // console.log(err.message);
          });
        } else {
          this.nos.newOrders.push(this.nos.newOrder);
          localStorage.setItem('newOrders', JSON.stringify(this.nos.newOrders));
          setTimeout(() => {
            window.location.href = 'https://m.printposters.in/canvas-prints/cart';
          }, 1000);
        }
      }
    }, err => {
      this.uploadProgress = -1;
      document.getElementById('img-button').innerText = `Add To Cart`;
      // console.log(err);
      // console.log(err.message);
    });
    // const order: Order = {
    //   amount: this._size[this._size['customerSelected']],
    //   imgsrc: this.imgsrc.src,
    //   createdOn: Date.now(),
    //   productInfo: '',
    //   size: this._size,
    //   user: res.user,
    //   selectedWrap: this.selectedWrap,
    //   previewColor: this.previewColor
    // };
    // // console.log(order);
    // this.sharedSvc.order = order;

    //   } else {
    //     this.router.navigate(['/login']);
    //     this.helper.showSnackbar(res.msg);
    //   }
    // }, err => {
    //   if (err.status === 401) {
    //     this.helper.showSnackbar(`${err.status}: Session Expired`);
    //     this.router.navigate(['/login']);
    //   } else {
    //     this.uploadProgress = 0;
    //     document.getElementById('img-button').innerText = `Add To Cart`;
    //     this.helper.showSnackbar(`Internal Server Error: ${err.status}`);
    //   }
    // });
    // } else {
    //   this.uploadProgress = 0;
    //   document.getElementById('img-button').innerText = `Add To Cart`;
    //   this.helper.showSnackbar(`Please Login First`);
    //   // this.router.navigate(['/login']);
    //   const dialogRef = this.dialog.open(DialogLoginComponent);

    //   dialogRef.afterClosed().subscribe(result => {
    //     // console.log(`Dialog result: ${result}`);
    //   });
    // }
  }

  makePayment2() {
    if (this.authService.loggedIn()) {
      this.authService.getProfile().subscribe((res: any) => {
        if (res.success) {

          const order: Order = {
            amount: this._size[this._size['customerSelected']],
            imgsrc: this.imgsrc.src,
            createdOn: Date.now(),
            productInfo: '',
            size: this._size,
            user: res.user,
            selectedWrap: this.selectedWrap,
            previewColor: this.previewColor
          };
          // console.log(order);
          this.sharedSvc.order = order;
          this.router.navigateByUrl('cart');

        } else {
          this.router.navigate(['/login']);
          this.helper.showSnackbar(res.msg);
        }
      }, err => {
        if (err.status == 401) {
          this.helper.showSnackbar(`${err.status}: Session Expired`);
          this.router.navigate(['/login']);
        } else {
          this.helper.showSnackbar(`Internal Server Error: ${err.status}`);
        }
      });
    } else {
      this.helper.showSnackbar(`Please Login First`);
      // this.router.navigate(['/login']);
      const dialogRef = this.dialog.open(DialogLoginComponent);

      dialogRef.afterClosed().subscribe(result => {
        // console.log(`Dialog result: ${result}`);
      });
    }

  }

  onSelected(t: any) {
    if (t == 'gallaryWrap') {
      this.borderBottom = {};
      this.borderLeft = {};
      this.borderRight = {};
      this.previewColor = {};
      this.borderTop = {};
      this.selectedWrap = t;
    } else if (t == 'colorWrap') {
      const dialogRef = this.dialog.open(ColorPickerComponent, {
        data: { image: this.imgsrc }, height: '400px', width: '350px'
      });

      dialogRef.afterClosed().subscribe(result => {
        this.selectedWrap = t;
        this.borderBottom = {
          'background-color': result
        };
        this.borderLeft = {
          'background-color': result
        }
        this.borderRight = {
          'background-color': result
        }

        this.previewColor = {
          'background-color': result
        }
        this.borderTop = {
          'background-color': result
        }
      });
    } else if (t == 'mirrorWrap') {




      var flipButton = document.getElementById('flipButton');
      this.canvasImg = new Image(),
        this.canvasImg.onload = this.flipImage;
      this.canvasImg.src = this.imgsrc.src;



      this.selectedWrap = t;
      this.borderBottom = {
        // '-webkit-transform': 'rotateX(150deg)',
        // 'transform': 'rotateX(180deg)',
        'overflow': 'hidden',
        'background-image': 'url(' + this.imgsrc.src + ')',
        'background-size': 'cover'
      };
      this.borderLeft = {
        // '-webkit-transform': 'rotateX(150deg)',
        // 'transform': 'rotateX(45deg)',
        'overflow': 'hidden',
        'background-image': 'url(' + this.imgsrc.src + ')',
        'background-size': 'cover'
      };
      this.borderRight = {
        // '-webkit-transform': 'rotateX(150deg)',
        //'transform': 'rotateX(45deg)',
        'overflow': 'hidden',
        'background-image': 'url(' + this.imgsrc.src + ')',
        'background-size': 'cover'
      }
      this.borderTop = {
        // '-webkit-transform': 'rotateX(150deg)',
        //'transform': 'rotateX(90deg)',
        'overflow': 'hidden',
        'background-image': 'url(' + this.imgsrc.src + ')',
        'background-size': 'cover'
      }
    }
  }

  flipImage(img) {

    var flipH = true,
      flipV = false,
      width = 250,
      height = 200;

    var scaleH = flipH ? -1 : 1, // Set horizontal scale to -1 if flip horizontal
      scaleV = flipV ? -1 : 1, // Set verical scale to -1 if flip vertical
      posX = flipH ? 250 * -1 : 0, // Set x position to -100% if flip horizontal
      posY = flipV ? 200 * -1 : 0; // Set y position to -100% if flip vertical

    const canvas = <HTMLCanvasElement>document.getElementById('4'),
      ctx = canvas.getContext('2d'),


      canvas1 = <HTMLCanvasElement>document.getElementById('2'),
      ctx1 = canvas1.getContext('2d'),

      canvas2 = <HTMLCanvasElement>document.getElementById('5'),
      ctx2 = canvas2.getContext('2d'),

      canvas6 = <HTMLCanvasElement>document.getElementById('6'),
      ctx6 = canvas6.getContext('2d'),

      canvas3 = <HTMLCanvasElement>document.getElementById('3'),
      ctx3 = canvas3.getContext('2d');

    //ctx1.save(); // Save the current state
    //ctx1.scale(scaleH, scaleV); // Set scale to flip the image
    ctx1.drawImage(img.target, 0, 0, (parseInt(img.target.width) / parseInt(img.target.height)) * canvas1.height, canvas1.height); // draw the image
    //ctx1.restore(); // Restore the last saved state

    //ctx2.save(); // Save the current state
    ctx2.scale(1, -1); // Set scale to flip the image
    ctx2.drawImage(img.target, 0, -20, (parseInt(img.target.width) / parseInt(img.target.height)) * canvas1.height, canvas1.height); // draw the image
    //ctx2.restore(); // Restore the last saved state



    //ctx6.save(); // Save the current state
    ctx6.scale(1, -1); // Set scale to flip the image
    ctx6.drawImage(img.target, 0, -canvas1.height, (parseInt(img.target.width) / parseInt(img.target.height)) * canvas1.height, canvas1.height); // draw the image
    //ctx6.restore(); // Restore the last saved state


    // console.log(img);

    //ctx.save(); // Save the current state
    ctx.scale(-1, 1); // Set scale to flip the image
    ctx.drawImage(img.target, -canvas1.width, 0, (parseInt(img.target.width) / parseInt(img.target.height)) * canvas1.height, canvas1.height); // draw the image


    // ctx3.save();
    // ctx3.translate(canvas3.width / 2, canvas3.height / 2);
    ctx3.scale(1, 1); // Set scale to flip the image
    ctx3.drawImage(img.target, 0, 0, (parseInt(img.target.width) / parseInt(img.target.height)) * canvas1.height, canvas1.height); // draw the image
    // ctx3.restore();
  }
  showBorder() {
    // if(this.selectedWrap=='colorWrap'){
    //  this.borderValue={
    //   'background-color':this.color
    //  }
    // }else if(this.selectedWrap=='mirrorWrap'){
    //  this.borderValue={
    //     '-webkit-transform': 'rotateX(150deg)',
    //     'transform': 'rotateX(180deg)',
    //     'overflow': 'hidden',
    //     'background-image':'url('+this.imgsrc.src +')',
    //  }
    // }else{
    //   this.borderValue={
    //     'text-align':'center'
    //   }
    // }
  }
}

@Component({
  selector: 'preview-dialog',
  templateUrl: 'preview-dialog.html',
})
export class PreviewDialog implements OnInit {

  previewImg: any;

  constructor(
    private authService: AuthService
  ) {
    this.previewImg = this.authService.getimgsrc();
  }

  ngOnInit() {

  }
}

@Component({
  selector: 'dialog-login',
  templateUrl: './logindialog.component.html',
  styleUrls: ['./logindialog.component.scss']
})
export class DialogLoginComponent implements OnInit {

  loginForm: FormGroup
  constructor(
    private dialogRef: MatDialogRef<DialogLoginComponent>,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private helper: HelperService,
    private matIconRegistry: MatIconRegistry,
    private router: Router
  ) {
    this.matIconRegistry.addSvgIcon(
      "fblogo",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/imgs/facebook.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "google",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/imgs/google.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "twitter",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/imgs/twitter.svg")
    );

    this.loginForm = fb.group({
      'email': ['', [Validators.email, Validators.required]],
      'password': ['', [Validators.minLength(5), Validators.required]]
    })

  }

  ngOnInit() {
    if (this.authSvc.loggedIn()) {
      history.back();
    }
  }

  async login() {
    if (!this.loginForm.valid) {
      return;
    }
    const data = this.loginForm.value;
    await this.authSvc.authenticateUserObs(data);
    this.dialogRef.close();
    // this.authSvc.loginWithEmail(data.email,data.password).then(res=>{
    //   // console.log('login successful');
    // },err=>{
    //   // console.log('login failed');
    //   this.helper.showSnackbar('invalid email or password');
    // })
  }

  goToRegister() {
    this.router.navigate(['/register']);
    this.dialogRef.close();
  }

}
