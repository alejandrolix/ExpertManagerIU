import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListadoSiniestrosComponent } from './siniestros/listado-siniestros/listado-siniestros.component';
import { HttpClientModule } from '@angular/common/http';
import { CrearSiniestroComponent } from './siniestros/crear-siniestro/crear-siniestro.component';

@NgModule({
  declarations: [
    AppComponent,    
    ListadoSiniestrosComponent, CrearSiniestroComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
