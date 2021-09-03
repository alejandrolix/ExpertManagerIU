import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { RespuestaApi } from "../interfaces/respuestaApi";

@Injectable()
export class PeticionHttp {
    constructor(private http: HttpClient) {}

    public hacerPeticionGet<T>(url: string): Observable<T> {
        return this.http.get<RespuestaApi>(url)
            .pipe(
                tap((respuesta: RespuestaApi) => {
                    if (respuesta.codigoRespuesta === 500 && respuesta.mensaje)
                        throw new Error(respuesta.mensaje);     // El mensaje del error se procesa en la función "catchError".                    

                    return throwError('');
                }),
                map((respuesta: RespuestaApi) => respuesta.datos),
                catchError((error: any) => {
                    if (error.error === 'no token')
                        return throwError('No existe token. Por favor, inicie sesión');                    
                    else if (error.status === 0)
                        return throwError('No funciona la API REST');

                    return throwError('Ha habido un error al obtener los datos');                                                            
                })
            );
    }

    public hacerPeticionPost<T>(url: string, datos: any): Observable<T> {
        return this.http.post<RespuestaApi>(url, datos)
            .pipe(
                tap((respuesta: RespuestaApi) => {
                    if (respuesta.codigoRespuesta === 500 && respuesta.mensaje)
                        throw new Error(respuesta.mensaje);     // El mensaje del error se procesa en la función "catchError".

                    return throwError(null);
                }),
                map((respuesta: RespuestaApi) => respuesta.datos),
                catchError((error: Error) => {
                    if (error.message)
                        return throwError(error.message);

                    return throwError('Ha habido un error al crear');
                })
            );
    }

    public hacerPeticionPut<T>(url: string, datos: any): Observable<T> {
        return this.http.put<RespuestaApi>(url, datos)
            .pipe(
                tap((respuesta: RespuestaApi) => {
                    if (respuesta.codigoRespuesta === 500 && respuesta.mensaje)
                        throw new Error(respuesta.mensaje);     // El mensaje del error se procesa en la función "catchError".

                    return throwError(null);
                }),
                map((respuesta: RespuestaApi) => respuesta.datos),
                catchError((error: Error) => {
                    if (error.message)
                        return throwError(error.message);

                    return throwError('Ha habido un error al actualizar');
                })
            );
    }

    public hacerPeticionDelete<T>(url: string): Observable<T> {
        return this.http.delete<RespuestaApi>(url)
            .pipe(
                tap((respuesta: RespuestaApi) => {
                    if (respuesta.codigoRespuesta === 500 && respuesta.mensaje)
                        throw new Error(respuesta.mensaje);     // El mensaje del error se procesa en la función "catchError".

                    return throwError(null);
                }),
                map((respuesta: RespuestaApi) => respuesta.datos),
                catchError((error: Error) => {
                    if (error.message)
                        return throwError(error.message);

                    return throwError('Ha habido un error al eliminar');
                })
            );
    }
}