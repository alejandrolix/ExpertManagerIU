import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { RespuestaApi } from "../interfaces/respuestaApi";

export class PeticionHttp {
    constructor(private http: HttpClient) {}

    public hacerPeticionGet<T>(url: string): Observable<T> {
        return this.http.get<RespuestaApi>(url)
            .pipe(
                map((respuesta: RespuestaApi) => respuesta.datos),
                catchError(error => {
                    if (error.codigoRespuesta === 500 && error.mensaje)
                        return throwError(error.mensaje);

                    return throwError('Ha habido un error al obtener los datos');
                })
            );
    }
}