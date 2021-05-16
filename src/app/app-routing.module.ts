import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearSiniestroComponent } from './siniestros/crear-siniestro/crear-siniestro.component';
import { DetallesSiniestroComponent } from './siniestros/detalles-siniestro/detalles-siniestro.component';
import { EditarSiniestroComponent } from './siniestros/editar-siniestro/editar-siniestro.component';
import { ListadoSiniestrosComponent } from './siniestros/listado-siniestros/listado-siniestros.component';
import { SubirDocumentacionComponent } from './siniestros/subir-documentacion/subir-documentacion.component';
import { SubirImagenComponent } from './siniestros/subir-imagen/subir-imagen.component';

const routes: Routes = [
  {
    path: 'siniestros',
    component: ListadoSiniestrosComponent
  },
  {
    path: 'crearSiniestro',
    component: CrearSiniestroComponent
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
