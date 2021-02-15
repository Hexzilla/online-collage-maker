import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Subject} from 'rxjs/Subject'; 

// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { User } from 'src/datamodel/user';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  invokeEvent: Subject<any> = new Subject(); 
  invokeEvent1: Subject<any> = new Subject();

  constructor(
    // private afs: AngularFirestore
    private http: HttpClient
  ) { }

  getGalleryProducts(skip, limit) {
    return this.http.get(`${environment.url}/api/gimages/list/${skip}/${limit}`);
  }

  getGalleryProductsPost(skip, limit, query) {
    return this.http.post(`${environment.url}/api/gimages/list/${skip}/${limit}`, { query });
  }

  getGalleryCats() {
    return this.http.get(`${environment.url}/api/gimages/listCategories`);
  }

  getGalleryProductBySlug(slug) {
    return this.http.get(`${environment.url}/api/gimages/byslug/${slug}`);
  }

  imgData:any;  

  setData(myData){
    this.imgData = myData;
  }
  getData(){
    return this.imgData;
  }


  loadImageCategory(someValue){
    this.invokeEvent.next(someValue)
  }

  reloadComp(){
      this.invokeEvent1.next();
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
