import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class PeticionHttp {
    constructor(private http: HttpClient) {}

    public hacerPeticionGet<T>(url: string): Observable<T> {
        return this.http.get<T>(url)
                        .pipe(
                            catchError((error: any) => this.obtenerMensajeError(error))
                        );
    }

    private obtenerMensajeError(error: any): Observable<never> {
        if (error.status === 0)
            return throwError('No funciona la API REST');
        else if (error.error)
            return throwError(error.error);

        return throwError(error);
    }

    public hacerPeticionGetConOpciones(url: string, opciones: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
    }): Observable<Blob> {
        return this.http.get(url, opciones)
                        .pipe(
                            catchError((error: any) => this.obtenerMensajeError(error))
                        );
    }

    public hacerPeticionPost<T>(url: string, datos: any): Observable<T> {
        return this.http.post<T>(url, datos)
                        .pipe(
                            catchError((error: any) => this.obtenerMensajeError(error))
                        );
    }

    public hacerPeticionPut<T>(url: string, datos: any): Observable<T> {
        return this.http.put<T>(url, datos)
                        .pipe(
                            catchError((error: any) => this.obtenerMensajeError(error))
                        );
    }

    public hacerPeticionDelete<T>(url: string): Observable<T> {
        return this.http.delete<T>(url)
                        .pipe(
                            catchError((error: any) => this.obtenerMensajeError(error))
                        );
    }
}