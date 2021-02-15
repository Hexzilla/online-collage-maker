import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() { }

  setToken(token) {
    localStorage.setItem('id_token', token);
  }

  getToken() {
    const token = localStorage.getItem('id_token');
    // // // // console.log('TOken' + token);
    return token;
  }

  deleteToken() {
    localStorage.removeItem('id_token');
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  // getTokenExpirationDate(token: string): Date {
  //   const decoded = jwt_decode(token);
  //   if (decoded.exp === undefined) {
  //     return null;
  //   }
  //   const date = new Date(0);
  //   date.setUTCSeconds(decoded.exp);
  //   // // // // console.log(date);
  //   return date;
  // }

  // isTokenExpired(token?: string): boolean {
  //   if (!token) {
  //     token = this.getToken();
  //   }
  //   if (!token) {
  //     return true;
  //   }
  //   const date = this.getTokenExpirationDate(token);
  //   if (date === undefined) {
  //     return false;
  //   }
  //   // // // console.log( !(date.valueOf() > new Date().valueOf()));
  //   return !(date.valueOf() > new Date().valueOf());
  // }
}
