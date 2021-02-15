import { Component, OnInit, Input, Inject } from '@angular/core';
import { Size } from '../test/test.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared.service';
import { AuthService } from 'src/app/auth.service';
import { HelperService } from 'src/app/helper.service';
import { UserService } from 'src/app/user.service';
import { OrderService } from 'src/app/order.service';
import { Order } from 'src/datamodel/order';
import { Router } from '@angular/router';

interface Display {
  square?: boolean;
  potrait?: boolean;
  landscape?: boolean;
}

@Component({
  selector: 'app-preview-selector',
  templateUrl: './preview-selector.component.html',
  styleUrls: ['./preview-selector.component.scss']
})

export class PreviewSelectorComponent implements OnInit {

  private _img: any;
  private _size: Size;

  display: Display = {
    landscape: false,
    potrait: false,
    square: false,
  };
  height: string;
  width: string;
  amount: number;
  constructor(private router: Router, public dialog: MatDialog, private helper: HelperService,
    private userSvc: UserService, private sharedSvc: SharedService,
    private orderSvc: OrderService, private authService: AuthService) {
    if (this.sharedSvc.order) {
      this.amount = this.sharedSvc.order.amount
    }

  }

  @Input()
  set imgsrc(val) {
    this._img = val;

  }

  get imgsrc() {
    return this._img;
  }

  ngOnInit() {

  }

  @Input()
  set size(size) {
    this._size = size;
    if (this.size) {
      this.setPreview();
      this.amount = this.sharedSvc.order.amount;
    }
  }

  get size() {
    return this._size;
  }

  setPreview() {
    ///condition 1 - when fixedSize (height) is less then recommendedSize (width) - landscape size
    let h: number = 200;
    let w: number = 200;

    if (this.size.fixedSize < this.size.recommendedSize) {
      this.height = (this.size.fixedSize * 10) + "px";
      this.width = (this.size.recommendedSize * 10) + "px";
      // if(this.size.fixedSize<=20){
      //   h=200;
      //   w=300;
      //   this.height=(h-((h*10)/100))+"px";
      //   this.width=(w-((w*10)/100))+"px";
      // }
      // if(this.size.fixedSize>20){
      //   this.height=(h+((h*10)/100))+"px";
      //   this.width=(w+((w*10)/100))+"px";
      // }
    } else if (this.size.fixedSize > this.size.recommendedSize) //condition 2: potrait mode screen
    {
      h = 300;
      w = 200;
      if (this.size.fixedSize <= 20) {
        this.height = (h - ((h * 10) / 100)) + "px";
        this.width = (w - ((w * 10) / 100)) + "px";
      }
      if (this.size.fixedSize > 20) {
        this.height = (h + ((h * 10) / 100)) + "px";
        this.width = (w + ((w * 10) / 100)) + "px";
      }


    } else if (this.size.fixedSize == this.size.recommendedSize) {
      this.height = "200px";
      this.width = "200px";
    }
  }

  showEdit() {
    // console.log('show edit clicked');
    // const dialogRef = this.dialog.open(ImageEditorDialog, {
    //   data: {image:this.imgsrc}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('The dialog was closed',result);
    //   debugger;
    //   //this.imgsrc=result
    // });
  }

  // makePayment1(){
  //   if(this.authService.fbUser){
  //     this.userSvc.getCurrentUser(this.authService.fbUser.uid).subscribe(r=>{

  //     let order:Order={
  //       amount:this._size.rolledCanvas,
  //       createdOn:Date.now(),
  //       productInfo:'',
  //       size:this._size,
  //       user:r
  //     }

  //     this.orderSvc.createOrder(order).then((res)=>{

  //       this.helper.showSnackbar('thank you for making payment . your order has been created.');

  //     },err=>{
  //       // console.log(err);
  //     });
  //     })


  //   }else{
  //     this.helper.showSnackbar('You are not logged In. please login to save your order and make payment');
  //   }
  // }

  makePayment() {
    this.router.navigateByUrl('cart');
  }
}


@Component({

  templateUrl: 'imageeditordialog.html',
})
export class ImageEditorDialog {

  public config: any;
  constructor(private sharedSvc: SharedService, public dialogRef: MatDialogRef<ImageEditorDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
    debugger;
  }


  ngOnInit() {
    this.config = {
      AspectRatios: ["1:1", "4:3", "16:9"],
      ImageType: 'image/jpeg',
      File: this.sharedSvc.imgFile
    }
  }

  public close(ev: any) {
    this.dialogRef.close();
  }

  public getEditedFile(file: File) {
    this.dialogRef.close(file);
  }



}
