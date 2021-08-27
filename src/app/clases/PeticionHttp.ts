import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { RespuestaApi } from "../interfaces/respuestaApi";

export class PeticionHttp {
    constructor(private http: HttpClient) {}

    public hacerPeticionGet<T>(url: string): Observable<T> {
        return this.http.get<RespuestaApi>(url)
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

                    return throwError('Ha habido un error al obtener los datos');
                })
            );
    }
}