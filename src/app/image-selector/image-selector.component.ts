import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { HelperService } from '../helper.service';
import { SharedService } from '../shared.service';
import { OrderService } from '../order.service';
import { NeworderService } from '../services/neworder.service';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CanvasComponent } from '../order/canvas/canvas.component';
import { ProductService } from '../services/product.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent implements OnInit {
  img = new Image();
  newUpload = true;
  compressImg = new Image();
  // Main task
  task: AngularFireUploadTask;
  selectedFile: File;

  @Output() onImageSelected = new EventEmitter<any>();
  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;
  progress = 0;
  constructor(
    private imageCompress: NgxImageCompressService,
    private shared: SharedService,
    private helper: HelperService,
    private nos: NeworderService,
    private as: AuthService,
    private router: Router,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private ps: ProductService,
    private http: HttpClient
    // private storage: AngularFireStorage,
    // private userSvc: UserService,
    // private orderSvc: OrderService
  ) {
    this.nos.newOrder = {
      orderId: '',
      customerId: '',
      delivery_address: [],
      email: '',
      fname: '',
      message: '',
      mobile: '',
      orderStatus: 'not placed',
      originalurl: {},
      url: {},
      payment_mode: 'payumoney',
      pinfo: '',
      udf5: '',
      amount: 0,
      products: {
        type: '',
        size: {},
        corrections: [],
        wrapType: 'not applied'
      }
    };
    this.route.params.subscribe(param => {
      const slug = param.slug;
      if (slug) {
        this.ps.getGalleryProductBySlug(slug)
          .subscribe((resp: any) => {
            if (resp.success) {
              console.log(resp.categories);
              this.http.get(`${environment.url}/file/downloadGallary/${resp.categories.image}`, {
                responseType: 'blob'
              })
                .subscribe(resp => {

                  const file = resp;
                  const fileReader = new FileReader();

                  fileReader.readAsDataURL(file);
                  fileReader.onload = ((ev: any) => {

                    if (ev.loaded === ev.total) {

                      this.img.setAttribute('src', ev.target.result);
                      this.compressImg.setAttribute('src', this.img.src);
                      this.img.onload = (ev: any) => {
                        this.checkRatio();
                        this.shared.img = this.img;
                        this.onImageSelected.emit({ file: file, img: this.img });
                      };
                    }
                  });

                  fileReader.onerror = ((err) => {
                    this.helper.showSnackbar('There was an error encountered while uploading the image');
                    // console.log(err);
                  });

                  fileReader.onprogress = ((progressEvent: ProgressEvent) => {
                    this.progress = ((progressEvent.loaded / progressEvent.total) * 100);
                  });
                  this.onImageSelected.emit({ file: file, img: this.img });
                });
            } else {
              this.helper.showSnackbar(resp.msg);
            }
          }, err => {
            this.helper.showSnackbar(err.message);
          });
      }
    })
  }

  ngOnInit() {
    document.querySelector('mat-sidenav-content').scroll(0, 0);
  }



  openDialog() {
    // console.log('show edit clicked');
    this.shared.ratioHeight = this.compressImg.height;
    this.shared.ratioWidth = this.compressImg.width;
    this.shared.maintainAspectRatio = false;
    // this.shared.img = this.nos.Img_HTML_edited;
    this.shared.img = this.compressImg;
    const dialogRef = this.dialog.open(CanvasComponent, {
      // data: { image: this.nos.Img_HTML_edited },
      data: { image: this.compressImg },
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      // // console.log('The dialog was closed', result);
      console.log('The dialog was closed');
      if (result) {
        const img = {
          src: result
        };
        this.img.src = img.src;
        // this.compressImg.src = img.src;
        console.log('set cropped view');
        this.compressImg.setAttribute('src', img.src);
        // this.imgsrc = img;
        // this.nos.Img_HTML_edited.src = img.src;
      }
    });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.shared.cropHeight = undefined;
    this.shared.cropWidth = undefined;
    this.shared.img = undefined;
    this.shared.imgFile = undefined;
    this.shared.order = undefined;
    this.shared.ratioHeight = undefined;
    this.shared.ratioWidth = undefined;
  }

  onUpload() {
    // upload code goes here
  }

  checkLogin() {
    if (!(this.as.loggedIn())) {
      this.router.navigate(['/login']);
      return false;
    } else {
      this.as.getProfile().subscribe((res: any) => {
        if (!(res.success)) {
          this.router.navigate(['/login']);
          this.helper.showSnackbar(res.msg);
        }
      }, err => {
        this.helper.showSnackbar(err.message);
      });
    }
  }

  selectImage(e: any, event) {
      const file = event.target.files[0];

      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.onload = ((ev: any) => {

        if (ev.loaded === ev.total) {
          const orientation: any = {};
          this.img.setAttribute('src', ev.target.result);
          this.img.onload = (ev2: any) => {
            this.checkRatio();
            this.shared.img = this.img;
            this.onImageSelected.emit({ file, img: this.img });
            if (!this.newUpload) {
              return;
            }
            this.newUpload = false;
            const checkParam = this.img.height > this.img.width ? this.img.height : this.img.width;
            if (checkParam > 1000 && checkParam <= 2000) {
              this.imageCompress
              .compressFile(ev.target.result, orientation, 100, 30)
              .then((result) => {
                this.compressImg.setAttribute('src', result);
              })
              .catch((err) => {
                console.log(err);
              });
            } else if (checkParam > 2000 && checkParam <= 3000) {
              this.imageCompress
              .compressFile(ev.target.result, orientation, 100, 20)
              .then((result) => {
                this.compressImg.setAttribute('src', result);
              })
              .catch((err) => {
                console.log(err);
              });
            } else if (checkParam > 3000) {
              this.imageCompress
              .compressFile(ev.target.result, orientation, 100, 15)
              .then((result) => {
                this.compressImg.setAttribute('src', result);
              })
              .catch((err) => {
                console.log(err);
              });
            } else {
              this.compressImg.setAttribute('src', this.img.src);
            }
          };
        }
      });

      fileReader.onerror = ((err) => {
        this.helper.showSnackbar('There was an error encountered while uploading the image');
      });

      fileReader.onprogress = ((progressEvent: ProgressEvent) => {
        this.progress = ((progressEvent.loaded / progressEvent.total) * 100);
      });
      this.onImageSelected.emit({ file, img: this.img });
  }

  // startUpload(e: any, event) {
  //   this.progress = 0;
  //   // console.log(e.files[0]);
  //   const file = e.files[0];
  //   const selectedFile = event.target.files[0]
  //   if (file.type.split('/')[0] !== 'image') {
  //     console.error('unsupported file type :( ')
  //     return;
  //   }
  //   const uploadData = new FormData();
  //   uploadData.append('myFile', selectedFile, selectedFile.name);
  //   // this.orderSvc.uploadImg(uploadData).then((res)=>{

  //   //       },err=>{
  //   //         // console.log(err);
  //   //       });
  //   let fileReader = new FileReader();

  //   fileReader.readAsDataURL(file);
  //   fileReader.onload = ((ev: any) => {

  //     if (ev.loaded == ev.total) {

  //       this.img.setAttribute("src", ev.target.result);
  //       this.img.onload = (ev) => {
  //         // console.log(this.img.height);
  //         // console.log(this.img.width);
  //         this.checkRatio();
  //         this.shared.img = this.img;
  //         this.onImageSelected.emit({ file: file, img: this.img });




  //       }
  //     }
  //   });

  //   fileReader.onerror = ((err) => {
  //     this.helper.showSnackbar('There was an error encountered while uploading the image');
  //     // console.log(err);
  //   });

  //   fileReader.onprogress = ((progressEvent: ProgressEvent) => {
  //     this.progress = ((progressEvent.loaded / progressEvent.total) * 100);
  //   })
  // }

  checkRatio() {
    if (this.img.height > this.img.width) {
      // console.log('potrait image');
    } else {
      // console.log('landscape image');
    }
  }
}
