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
                            catchError((error: any) => {                    
                                if (error.error === 'no token')
                                    return throwError('No existe token. Por favor, inicie sesión');
                                else if (error.status === 0)                    
                                    return throwError('No funciona la API REST');
                                
                                return throwError(error.error);
                            })
                        );
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
                            catchError((error: any) => {                    
                                if (error.error === 'no token')
                                    return throwError('No existe token. Por favor, inicie sesión');
                                else if (error.status === 0)                    
                                    return throwError('No funciona la API REST');
                                
                                return throwError(error.error);
                            })
                        );
    }

    public hacerPeticionGetConOpcionesString(url: string, opciones: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
    }): Observable<string> {
        return this.http.get(url, opciones)
                        .pipe(
                            catchError((error: any) => {                    
                                if (error.error === 'no token')
                                    return throwError('No existe token. Por favor, inicie sesión');
                                else if (error.status === 0)                    
                                    return throwError('No funciona la API REST');
                                
                                return throwError(error.error);
                            })
                        );
    }

    public hacerPeticionPost<T>(url: string, datos: any): Observable<T> {
        return this.http.post<T>(url, datos)
                        .pipe(
                            catchError((error: any) => {
                                if (error.error === 'no token')
                                    return throwError('No existe token. Por favor, inicie sesión');
                                else if (error.status === 0)                    
                                    return throwError('No funciona la API REST');
                                
                                return throwError(error.error);
                            })
                        );
    }

    public hacerPeticionPut<T>(url: string, datos: any): Observable<T> {
        return this.http.put<T>(url, datos)
                        .pipe(
                            catchError((error: any) => {                    
                                if (error.error === 'no token')
                                    return throwError('No existe token. Por favor, inicie sesión');
                                else if (error.status === 0)                    
                                    return throwError('No funciona la API REST');
                                
                                return throwError(error.error);
                            })
                        );
    }

    public hacerPeticionDelete<T>(url: string): Observable<T> {
        return this.http.delete<T>(url)
                        .pipe(
                            catchError((error: any) => {                    
                                if (error.error === 'no token')
                                    return throwError('No existe token. Por favor, inicie sesión');
                                else if (error.status === 0)                    
                                    return throwError('No funciona la API REST');
                                
                                return throwError(error.error);
                            })
                        );
    }
}