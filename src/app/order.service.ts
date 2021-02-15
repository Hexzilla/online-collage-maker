import { Injectable } from "@angular/core";
// import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Order } from "src/datamodel/order";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../environments/environment";
import { HelperService } from "./helper.service";
import { payment } from "../assets/js/autoinit.js";
import { NeworderService } from "./services/neworder.service";

const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" }),
};

@Injectable({
  providedIn: "root",
})
export class OrderService {
  public order: Order;
  status: any;
  // fbfunction= "http://localhost:5000/printposters-3ca7f/us-central1/sendEmail";
  fbfunction =
    "https://us-central1-printposters-3ca7f.cloudfunctions.net/sendEmail";
  constructor(
    // private afs: AngularFirestore,
    private http: HttpClient,
    private authService: AuthService,
    private helper: HelperService,
    private nos: NeworderService
  ) {}

  createOrder(order: Order) {
    return new Promise((resolve, reject) => {
      // this.afs.collection<Order>('orders').add(order).then((r: DocumentReference) => {
      //   order.orderId = r.id;
      //   this.updateOrder(order.orderId, order).then(r => {
      //     const js = JSON.stringify(order);
      //     this.http.post(this.fbfunction, { order: js }).subscribe(r => {
      //       if (r) {
      //         resolve(r);
      //       } else {
      //         reject();
      //       }
      //     }, err => {
      //       reject(err);
      //     })
      //   }, err => reject(err))
      // }, err => reject(err));
    });
  }

  paymentold(order: Order) {
    return new Promise((resolve, reject) => {
      const order = {
        firstname: "manish",
        lastname: "Agarwak",
        email: "magarwal516@gmail.com",
        phone: 9920949629,
        amount: 100,
        productinfo: "1",
        txnid: "sdssnssdbnmsdmnbsnbmsasa", // this must be a genrated at your side
        surl: "http:localhost:3000/payment/success",
        furl: "http:localhost:3000/payment/failure",
      };
      const js = order;
      this.http.post("http://localhost:3000/payment", { order: js }).subscribe(
        (r) => {
          if (r) {
            resolve(r);
          } else {
            reject();
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  payment(note: any, shippingAmount, totalAmount, udf5, addr: any) {
    this.authService.getProfile().subscribe((data: any) => {
      const fname = data.user.name.split(" ");
      let tpinfo = "";
      for (const ord of this.nos.newOrders) {
        tpinfo += ord.orderId + " ";
      }
      const order = {
        id: new Date().getTime().toString(),
        fname: addr[0].billingaddr.name.split(" ")[0],
        email: addr[0].billingaddr.email,
        mobile: addr[0].billingaddr.mobile,
        note: note,
        pinfo: JSON.stringify(this.nos.newOrders),
        amount: totalAmount,
        // amount: '1.00',
        orderAmount: totalAmount,
        // amount: (2).toFixed(2),
        udf5,
      };

      const data1 = JSON.stringify({
        txnid: order.id,
        amount: order.amount,
        pinfo: order.pinfo,
        fname: order.fname,
        email: order.email,
        mobile: order.mobile,
        udf5: order.udf5,
      });
      // console.log(data1);
      this.http
        .post(environment.url + "/products/genHash", data1, {
          responseType: "text",
        })
        .subscribe(
          (res: any) => {
            // // console.log(res);
            const hash = res;
            // console.log('hash');
            // console.log(hash);
            // console.log('order');
            // console.log(order);
            payment(order, hash, (err: any, res: any) => {
              if (err) {
                // console.log(err);
                this.helper.showSnackbar(err.message);
              } else {
                this.helper.showSnackbar(res.response.txnStatus);
                // if (res.response.txnStatus != 'CANCEL') {
                  this.status = res.response.txnStatus;
                  localStorage.setItem("paymentStatus", this.status);
                if (res.response.txnStatus !== "CANCEL") {
                  const p_res = res.response;
                  const p_res_hash = res.response.hash;

                  const data2 = JSON.stringify({
                    txnid: res.response.txnid,
                    amount: res.response.amount,
                    pinfo: res.response.productinfo,
                    fname: res.response.firstname,
                    email: res.response.email,
                    mobile: res.response.phone,
                    udf5: res.response.udf5,
                    status: res.response.status,
                  });
                  // console.log('res');
                  // console.log(res);
                  // console.log('data2');
                  // console.log(data2);
                  // console.log('p_res_hash');
                  // console.log(p_res_hash);

                  this.http
                    .post(environment.url + "/products/rescheck", data2, {
                      responseType: "text",
                    })
                    .subscribe((resp: any) => {
                      const res_hash = resp;
                      // console.log('resp');
                      // console.log(resp);
                      // console.log('res_hash');
                      // console.log(res_hash);
                      if (p_res_hash === res_hash) {
                        class NewOrder {
                          orderId: any;
                          amount: any;
                          shipping: any;
                          products: any;
                          pinfo: any;
                          fname: any;
                          email: any;
                          mobile: any;
                          udf5: any;
                          customerId: any;
                          orderStatus: any;
                          orderPlaced: any;
                          payment_mode: any;
                          delivery_address: any;
                          note: any;
                        }

                        const newOrder = new NewOrder();
                        newOrder.orderId = p_res.txnid;
                        newOrder.amount = totalAmount;
                        newOrder.shipping = shippingAmount;
                        newOrder.pinfo = order.pinfo;
                        newOrder.fname = order.fname;
                        newOrder.email = order.email;
                        newOrder.mobile = order.mobile;
                        newOrder.udf5 = order.udf5;
                        newOrder.customerId = data.user._id;
                        newOrder.orderPlaced = Date.now();
                        newOrder.orderStatus = "Pending";
                        newOrder.products = this.nos.newOrders;
                        newOrder.payment_mode = "PayUMoney " + `(${res.response.txnStatus})`;
                        newOrder.delivery_address = addr;
                        newOrder.note = note;

                        this.authService.placeOrder(newOrder);
                      } else {
                        this.helper.showSnackbar(`Hash Doesn't match`);
                      }
                    });
                } else {
                  const p_res = res.response;
                  const p_res_hash = res.response.hash;

                  const data2 = JSON.stringify({
                    txnid: res.response.txnid,
                    amount: res.response.amount,
                    pinfo: res.response.productinfo,
                    fname: res.response.firstname,
                    email: res.response.email,
                    mobile: res.response.phone,
                    udf5: res.response.udf5,
                    status: res.response.status,
                  });
                  // console.log('res');
                  // console.log(res);
                  // console.log('data2');
                  // console.log(data2);
                  // console.log('p_res_hash');
                  // console.log(p_res_hash);

                  this.http
                    .post(environment.url + "/products/rescheck", data2, {
                      responseType: "text",
                    })
                    .subscribe((resp: any) => {
                      const res_hash = resp;
                      // console.log('resp');
                      // console.log(resp);
                      // console.log('res_hash');
                      // console.log(res_hash);
                      if (p_res_hash === res_hash) {
                        class NewOrder {
                          orderId: any;
                          amount: any;
                          shipping: any;
                          products: any;
                          pinfo: any;
                          fname: any;
                          email: any;
                          mobile: any;
                          udf5: any;
                          customerId: any;
                          orderStatus: any;
                          orderPlaced: any;
                          payment_mode: any;
                          delivery_address: any;
                          note: any;
                        }

                        const newOrder = new NewOrder();
                        newOrder.orderId = p_res.txnid;
                        newOrder.amount = totalAmount;
                        newOrder.shipping = shippingAmount;
                        newOrder.pinfo = order.pinfo;
                        newOrder.fname = order.fname;
                        newOrder.email = order.email;
                        newOrder.mobile = order.mobile;
                        newOrder.udf5 = order.udf5;
                        newOrder.customerId = data.user._id;
                        newOrder.orderPlaced = Date.now();
                        newOrder.orderStatus = "Pending";
                        newOrder.products = this.nos.newOrders;
                        newOrder.payment_mode = "PayUMoney " + `(${res.response.txnStatus})`;
                        newOrder.delivery_address = addr;
                        newOrder.note = note;

                        this.authService.placeOrder(newOrder);
                      } else {
                        this.helper.showSnackbar(`Hash Doesn't match`);
                      }
                    });
                }
              }
            });
          },
          (err) => {
            // console.log(err);
          }
        );
    });
  }

  uploadImg(uploadData) {
    return new Promise((resolve, reject) => {
      this.http
        .post("http://localhost:3000/orders/uploadImg", uploadData)
        .subscribe(
          (r) => {
            if (r) {
              resolve(r);
            } else {
              reject();
            }
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  // updateOrder(orderId: string, order: Order) {
  //   return this.afs.collection<Order>('orders').doc(orderId).update(order);
  // }

  // getAllOrders(uid: string) {
  //   return this.afs.collection<Order>('orders', ref => ref.where('uid', '==', uid)).valueChanges();
  // }

  // getOrderById(uid, string, orderId: string) {
  //   return this.afs.collection<Order>('orders', ref => ref.where('uid', '==', uid).where('orderId', '==', orderId)).valueChanges();
  // }
}
