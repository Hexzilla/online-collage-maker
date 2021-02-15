import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  _req: any;

  constructor(private tokenService: TokenService) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig = {};
    const token = this.tokenService.getToken();
    if (token) {
      headersConfig['Authorization'] = token;
      headersConfig['routePath'] = window.location.href;
    }
    // // console.log(window.location.href);
    this._req = req.clone({ setHeaders: headersConfig });
    return next.handle(this._req);
    // // // // console.log(_req);
  }
}
