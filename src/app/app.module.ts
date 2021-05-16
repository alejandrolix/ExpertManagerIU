import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListadoSiniestrosComponent } from './siniestros/listado-siniestros/listado-siniestros.component';
import { HttpClientModule } from '@angular/common/http';
import { CrearSiniestroComponent } from './siniestros/crear-siniestro/crear-siniestro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditarSiniestroComponent } from './siniestros/editar-siniestro/editar-siniestro.component';
import { DetallesSiniestroComponent } from './siniestros/detalles-siniestro/detalles-siniestro.component';
import { SubirDocumentacionComponent } from './siniestros/subir-documentacion/subir-documentacion.component';
import { SubirImagenComponent } from './siniestros/subir-imagen/subir-imagen.component';

@NgModule({
  declarations: [
    AppComponent,    
    ListadoSiniestrosComponent, CrearSiniestroComponent, EditarSiniestroComponent, DetallesSiniestroComponent, SubirDocumentacionComponent, SubirImagenComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
