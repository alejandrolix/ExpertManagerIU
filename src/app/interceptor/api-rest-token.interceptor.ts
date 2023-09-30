import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Alerta } from '../clases/Alerta';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { SpinnerService } from '../servicios/spinner.service';

@Injectable()
export class ApiRestTokenInterceptor implements HttpInterceptor {

  constructor(private autenticacionService: AutenticacionService, private spinnerService: SpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token: string = this.autenticacionService.obtenerToken();

    request = request.clone({
      setHeaders: {
        authorization: `Bearer ${token}`
      }
    });

    return next.handle(request).pipe(
      catchError((error: any) => this.mostrarError(error))
    );
  }

  private mostrarError(error: any): Observable<never> {
    let mensaje: string;
    let cerrarSesion: boolean = false;
    const codigoSesionExpirada: number = 0;

    if (error.status === 0) {
      mensaje = 'No funciona la API REST';
      cerrarSesion = true;
    }
    else {
      if (typeof error.error === 'string') {
        mensaje = error.error;
      }
      else {
        mensaje = error.error.error;
      }

      if (error.error.codigoRespuesta === codigoSesionExpirada) {
        cerrarSesion = true;
      }
    }

    Alerta.mostrarError(mensaje);
    this.spinnerService.ocultarSpinner();

    if (cerrarSesion) {
      this.autenticacionService.cerrarSesion();
    }

    throw new Error(error);
  }
}