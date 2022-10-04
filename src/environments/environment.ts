// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let urlApi: string = '';

if (process.env.ES_CONTENEDOR === undefined) {
  urlApi = 'https://localhost:44345/api';
}
else {
  urlApi = 'http://em-api-rest-service:8080/api';
}

export const environment = {
  production: false,
  urlApi,
  urlHub: 'https://localhost:44345/mensajes'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
