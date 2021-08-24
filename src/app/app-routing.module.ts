import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { CrearMensajeComponent } from './componentes/siniestros/crear-mensaje/crear-mensaje.component';
import { CrearSiniestroComponent } from './componentes/siniestros/crear-siniestro/crear-siniestro.component';
import { DetallesSiniestroComponent } from './componentes/siniestros/detalles-siniestro/detalles-siniestro.component';
import { EditarSiniestroComponent } from './componentes/siniestros/editar-siniestro/editar-siniestro.component';
import { ListadoSiniestrosComponent } from './componentes/siniestros/listado-siniestros/listado-siniestros.component';
import { SiniestrosComponent } from './componentes/siniestros/siniestros.component';
import { SubirDocumentacionComponent } from './componentes/siniestros/subir-documentacion/subir-documentacion.component';
import { SubirImagenComponent } from './componentes/siniestros/subir-imagen/subir-imagen.component';
import { CrearUsuarioComponent } from './componentes/usuarios/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './componentes/usuarios/editar-usuario/editar-usuario.component';
import { ListadoUsuariosComponent } from './componentes/usuarios/listado-usuarios/listado-usuarios.component';
import { AccederRutaGuard } from './guards/acceder-ruta.guard';

const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent    
  },
  {
    path: 'siniestros',
    component: SiniestrosComponent,
    children: [
      {
        path: '',
        component: ListadoSiniestrosComponent
      },
      {
        path: 'crear',
        component: CrearSiniestroComponent,
        canActivate: [AccederRutaGuard]
      },
      {
        path: 'editar/:id',
        component: EditarSiniestroComponent,
        canActivate: [AccederRutaGuard]
      },
    ]
  },
  {
    path: 'crearMensaje/:id',
    component: CrearMensajeComponent,
    canActivate: [AccederRutaGuard]
  },  
  {
    path: 'detallesSiniestro/:id',
    component: DetallesSiniestroComponent
  },
  {
    path: 'subirDocumentacion/:id',
    component: SubirDocumentacionComponent,
    canActivate: [AccederRutaGuard]
  },
  {
    path: 'subirImagen/:id',
    component: SubirImagenComponent,
    canActivate: [AccederRutaGuard]
  },
  {
    path: 'usuarios',
    component: ListadoUsuariosComponent,
    canActivate: [AccederRutaGuard]
  },
  {
    path: 'crearUsuario',
    component: CrearUsuarioComponent,
    canActivate: [AccederRutaGuard]
  },
  {
    path: 'editarUsuario/:id',
    component: EditarUsuarioComponent,
    canActivate: [AccederRutaGuard]
  },
  {
    path: 'inicioSesion',
    component: InicioSesionComponent
  },
  {
    path: '**',
    component: InicioSesionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
