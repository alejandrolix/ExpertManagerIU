import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearSiniestroComponent } from './siniestros/crear-siniestro/crear-siniestro.component';
import { DetallesSiniestroComponent } from './siniestros/detalles-siniestro/detalles-siniestro.component';
import { EditarSiniestroComponent } from './siniestros/editar-siniestro/editar-siniestro.component';
import { ListadoSiniestrosComponent } from './siniestros/listado-siniestros/listado-siniestros.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
