import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiRestTokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('api/Usuarios/IniciarSesion'))   // Ignoramos la ruta de iniciar sesión. Es decir, no se comprueba si existe token.
      return next.handle(request);

    let token: string | null = sessionStorage.getItem('token');

    if (token) {
      let peticionToken: HttpRequest<unknown> = request.clone({
        setHeaders: {
          authorization: `Bearer ${token}`
        }
      });

      return next.handle(peticionToken);
    }

    return next.handle(request);
  }
}
