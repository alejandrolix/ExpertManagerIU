import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Alerta } from '../clases/Alerta';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Injectable()
export class ApiRestTokenInterceptor implements HttpInterceptor {

  constructor(private autenticacionService: AutenticacionService) {}

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

    return next.handle(request).pipe(
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
