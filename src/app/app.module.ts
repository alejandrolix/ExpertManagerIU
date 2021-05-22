import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListadoSiniestrosComponent } from './siniestros/listado-siniestros/listado-siniestros.component';
import { HttpClientModule } from '@angular/common/http';
import { CrearSiniestroComponent } from './siniestros/crear-siniestro/crear-siniestro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditarSiniestroComponent } from './siniestros/editar-siniestro/editar-siniestro.component';
import { DetallesSiniestroComponent } from './siniestros/detalles-siniestro/detalles-siniestro.component';
import { SubirDocumentacionComponent } from './siniestros/subir-documentacion/subir-documentacion.component';
import { SubirImagenComponent } from './siniestros/subir-imagen/subir-imagen.component';
import { ListadoUsuariosComponent } from './usuarios/listado-usuarios/listado-usuarios.component';
import { CrearUsuarioComponent } from './usuarios/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar-usuario/editar-usuario.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { CrearMensajeComponent } from './siniestros/crear-mensaje/crear-mensaje.component';
import { InicioComponent } from './inicio/inicio.component';

@NgModule({
  declarations: [
    AppComponent,    
    ListadoSiniestrosComponent, CrearSiniestroComponent, EditarSiniestroComponent, DetallesSiniestroComponent, SubirDocumentacionComponent, SubirImagenComponent, ListadoUsuariosComponent, CrearUsuarioComponent, EditarUsuarioComponent, InicioSesionComponent, CrearMensajeComponent, InicioComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
