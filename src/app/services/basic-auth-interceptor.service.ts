import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token') as string;

      req = req.clone({
        setHeaders: {
          Authorization: token,
        },
      });
    }

    return next.handle(req);
  }
}
