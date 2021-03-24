import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private http: HttpClient
  ) { }

  // tslint:disable: typedef
  getMenus() {
    return this.http.get(`${environment.url}/admin/menus/menuList`);
  }

  getSubmenus(menuId) {
    return this.http.get(`${environment.url}/admin/types/TypeByTopTypeId/${menuId}`);
  }
}
