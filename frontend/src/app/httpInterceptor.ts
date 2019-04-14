import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const api = this.injector.get(ApiService);
        console.log("Interceptor got called!");
        if(api.isLoggedIn) {
            // Manipulate HttpRequest
            req = req.clone({
                setHeaders: {
                    token: api.getToken()
                }
            });
              return next.handle(req);
        } else {
            return next.handle(req);
        }
    }
}
