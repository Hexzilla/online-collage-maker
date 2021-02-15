import { Injectable } from '@angular/core';
import { NewOrder } from 'src/datamodel/newOrder';

@Injectable({
  providedIn: 'root'
})
export class NeworderService {

  newOrders: NewOrder[] = JSON.parse(localStorage.getItem('newOrders')) ? JSON.parse(localStorage.getItem('newOrders')) : [];
  newOrder: NewOrder;
  dataURL_original: Blob;
  dataURL_edited: Blob;
  File_original: File;
  File_edited: File;
  Img_HTML_original: HTMLImageElement;
  Img_HTML_edited: HTMLImageElement;

  constructor() { }

}
