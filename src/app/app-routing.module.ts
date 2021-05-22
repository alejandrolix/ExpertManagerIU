import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { CrearMensajeComponent } from './componentes/siniestros/crear-mensaje/crear-mensaje.component';
import { CrearSiniestroComponent } from './componentes/siniestros/crear-siniestro/crear-siniestro.component';
import { DetallesSiniestroComponent } from './componentes/siniestros/detalles-siniestro/detalles-siniestro.component';
import { EditarSiniestroComponent } from './componentes/siniestros/editar-siniestro/editar-siniestro.component';
import { ListadoSiniestrosComponent } from './componentes/siniestros/listado-siniestros/listado-siniestros.component';
import { SubirDocumentacionComponent } from './componentes/siniestros/subir-documentacion/subir-documentacion.component';
import { SubirImagenComponent } from './componentes/siniestros/subir-imagen/subir-imagen.component';
import { CrearUsuarioComponent } from './usuarios/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar-usuario/editar-usuario.component';
import { ListadoUsuariosComponent } from './usuarios/listado-usuarios/listado-usuarios.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'siniestros',
    component: ListadoSiniestrosComponent
  },
  {
    path: 'crearSiniestro',
    component: CrearSiniestroComponent
  },
  {
    path: 'crearMensaje/:id',
    component: CrearMensajeComponent
  },
  {
    path: 'editarSiniestro/:id',
    component: EditarSiniestroComponent
  },
  {
    path: 'detallesSiniestro/:id',
    component: DetallesSiniestroComponent
  },
  {
    path: 'subirDocumentacion/:id',
    component: SubirDocumentacionComponent
  },
  {
    path: 'subirImagen/:id',
    component: SubirImagenComponent
  },
  {
    path: 'usuarios',
    component: ListadoUsuariosComponent
  },
  {
    path: 'crearUsuario',
    component: CrearUsuarioComponent
  },
  {
    path: 'editarUsuario/:id',
    component: EditarUsuarioComponent
  },
  {
    path: 'inicioSesion',
    component: InicioSesionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
