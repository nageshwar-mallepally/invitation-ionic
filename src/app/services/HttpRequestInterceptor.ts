import { Injectable } from '@angular/core';
import { SharedService } from '../services/shared.service';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Inject With Credentials into the request */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  loggedUser = {};

  constructor(private sharedService:SharedService) {

  }

  ngOnInit() {
    this.loggedUser = this.sharedService.getValue().loginDetails;
  }

  intercept(req:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>> {

    // console.log("interceptor: " + req.url);
    req = req.clone({
      withCredentials: true
    });

    return next.handle(req);

  }
}
