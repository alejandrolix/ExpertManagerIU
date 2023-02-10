import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Alerta } from '../clases/Alerta';
import { SpinnerService } from '../servicios/spinner.service';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Injectable()
export class ApiRestTokenInterceptor implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService, private autenticacionService: AutenticacionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let enviarTokenEnPeticion: boolean;

    if (request.url.includes('api/Usuarios/IniciarSesion'))   // Ignoramos la ruta de iniciar sesión.
      enviarTokenEnPeticion = false;

    let token: string = this.autenticacionService.obtenerToken();

    if (token.length === 0)
      enviarTokenEnPeticion = false;
    else
      enviarTokenEnPeticion = true;

    if (enviarTokenEnPeticion)
      request = request.clone({
        setHeaders: {
          authorization: `Bearer ${token}`
        }
      });

    this.spinnerService.mostrarSpinner();

    return next.handle(request).pipe(
      finalize(() => this.spinnerService.ocultarSpinner()),
      catchError((error: any) => this.mostrarError(error))
    );
  }

  private mostrarError(error: any): Observable<never> {
    let mensaje: string;

    if (error.status === 0)
      mensaje = 'No funciona la API REST';
    else
      mensaje = error.error;

    Alerta.mostrarError(mensaje);
    return throwError(mensaje);
  }
}
