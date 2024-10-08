import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { CrearEditarSiniestroComponent } from './componentes/siniestros/crear-editar-siniestro/crear-editar-siniestro.component';
import { CrearMensajeComponent } from './componentes/siniestros/crear-mensaje/crear-mensaje.component';
import { DetallesSiniestroComponent } from './componentes/siniestros/detalles-siniestro/detalles-siniestro.component';
import { ListadoSiniestrosComponent } from './componentes/siniestros/listado-siniestros/listado-siniestros.component';
import { SubirArchivoComponent } from './componentes/siniestros/subir-archivo/subir-archivo.component';
import { CrearEditarUsuarioComponent } from './componentes/usuarios/crear-editar-usuario/crear-editar-usuario.component';
import { ListadoUsuariosComponent } from './componentes/usuarios/listado-usuarios/listado-usuarios.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { ComprobarPermisoGuard } from './guards/comprobar-permiso.guard';
import { InicioSesionGuard } from './guards/inicio-sesion.guard';
import { AseguradorasComponent } from './componentes/aseguradoras/aseguradoras.component';

const routes: Routes = [
  {
    path: '',
    component: InicioSesionComponent,
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [InicioSesionGuard]
  },
  {
    path: 'siniestros',
    canActivate: [InicioSesionGuard],
    canActivateChild: [ComprobarPermisoGuard],
    children: [
      {
        path: '',
        component: ListadoSiniestrosComponent
      },
      {
        path: ':id/detalles',
        component: DetallesSiniestroComponent
      },
      {
        path: 'crear',
        component: CrearEditarSiniestroComponent
      },
      {
        path: ':id/editar',
        component: CrearEditarSiniestroComponent
      },
      {
        path: ':id/documentaciones/subir',
        component: SubirArchivoComponent
      },
      {
        path: ':id/imagenes/subir',
        component: SubirArchivoComponent
      },
      {
        path: ':id/mensajes/crear',
        component: CrearMensajeComponent
      }
    ]
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [InicioSesionGuard],
    children: [
      {
        path: '',
        component: ListadoUsuariosComponent
      }
    ]
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [InicioSesionGuard],
    canActivateChild: [ComprobarPermisoGuard],
    children: [
      {
        path: 'crear',
        component: CrearEditarUsuarioComponent
      },
      {
        path: ':id/editar',
        component: CrearEditarUsuarioComponent
      }
    ]
  },
  {
    path: 'aseguradoras',
    component: AseguradorasComponent,
    canActivate: [InicioSesionGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
