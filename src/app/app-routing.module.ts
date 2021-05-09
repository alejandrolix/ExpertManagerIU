import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearSiniestroComponent } from './siniestros/crear-siniestro/crear-siniestro.component';
import { ListadoSiniestrosComponent } from './siniestros/listado-siniestros/listado-siniestros.component';

const routes: Routes = [
  {
    path: 'siniestros',
    component: ListadoSiniestrosComponent
  },
  {
    path: 'crearSiniestro',
    component: CrearSiniestroComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
