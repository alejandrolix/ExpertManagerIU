import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiniestrosComponent } from './siniestros/siniestros.component';

const routes: Routes = [
  {
    path: 'siniestros',
    component: SiniestrosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
