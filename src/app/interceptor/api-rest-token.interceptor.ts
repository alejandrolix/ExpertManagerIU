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
    let enviarTokenEnPeticion: boolean;

    if (request.url.includes('api/Usuarios/IniciarSesion')) {   // Ignoramos la ruta de iniciar sesión.
      enviarTokenEnPeticion = false;
    }

    let token: string = this.autenticacionService.obtenerToken();

    if (token.length === 0) {
      enviarTokenEnPeticion = false;
    }
    else {
      enviarTokenEnPeticion = true;
    }

    if (enviarTokenEnPeticion) {
      request = request.clone({
        setHeaders: {
          authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: any) => this.mostrarError(error))
    );
  }

  private mostrarError(error: any): Observable<never> {
    let mensaje: string;
    let cerrarSesion: boolean = false;

    if (error.status === 0) {
      mensaje = 'No funciona la API REST';
      cerrarSesion = true;
    }
    else {
      mensaje = error.error;

      if (error.codigoRespuesta === CodigoRespuesta.SesionExpirada) {
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

enum CodigoRespuesta {
  SesionExpirada = 0
}
