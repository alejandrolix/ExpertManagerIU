import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListadoSiniestrosComponent } from './componentes/siniestros/listado-siniestros/listado-siniestros.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CrearSiniestroComponent } from './componentes/siniestros/crear-siniestro/crear-siniestro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditarSiniestroComponent } from './componentes/siniestros/editar-siniestro/editar-siniestro.component';
import { DetallesSiniestroComponent } from './componentes/siniestros/detalles-siniestro/detalles-siniestro.component';
import { SubirDocumentacionComponent } from './componentes/siniestros/subir-documentacion/subir-documentacion.component';
import { SubirImagenComponent } from './componentes/siniestros/subir-imagen/subir-imagen.component';
import { ListadoUsuariosComponent } from './componentes/usuarios/listado-usuarios/listado-usuarios.component';
import { CrearUsuarioComponent } from './componentes/usuarios/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './componentes/usuarios/editar-usuario/editar-usuario.component';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { CrearMensajeComponent } from './componentes/siniestros/crear-mensaje/crear-mensaje.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { MenuNavegacionComponent } from './componentes/menu-navegacion/menu-navegacion.component';
import { PiePaginaComponent } from './componentes/pie-pagina/pie-pagina.component';
import { SpinnerComponent } from './componentes/spinner/spinner.component';
import { ApiRestTokenInterceptor } from './interceptor/api-rest-token.interceptor';
import { SiniestrosComponent } from './componentes/siniestros/siniestros.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';

@NgModule({
  declarations: [
    AppComponent,    
    ListadoSiniestrosComponent, CrearSiniestroComponent, EditarSiniestroComponent, DetallesSiniestroComponent, SubirDocumentacionComponent, SubirImagenComponent, ListadoUsuariosComponent, CrearUsuarioComponent, EditarUsuarioComponent, InicioSesionComponent, CrearMensajeComponent, InicioComponent, MenuNavegacionComponent, PiePaginaComponent, SpinnerComponent, SiniestrosComponent, UsuariosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiRestTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
