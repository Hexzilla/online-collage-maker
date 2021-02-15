import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { User } from 'src/datamodel/user';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    // private afs: AngularFirestore
    private http: HttpClient
  ) { }

  getGalleryProducts() {
    return this.http.get(`${environment.url}/api/gimages/list`);
  }

  getGalleryProductBySlug(slug) {
    return this.http.get(`${environment.url}/api/gimages/byslug/${slug}`);
  }

  // getCanvasContent(){
  //   return this.afs.collection('contents').valueChanges();
  // }

  // getAllProduct(){
  //   return this.afs.collection('products').valueChanges();
  // }

  // getProductPricing() {}
  // getProductById(id:string){
  //   return this.afs.collection('products').doc(id).valueChanges();
  // }

}
