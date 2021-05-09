import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoSiniestrosComponent } from './siniestros/listado-siniestros/listado-siniestros.component';

const routes: Routes = [
  {
    path: 'siniestros',
    component: ListadoSiniestrosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
