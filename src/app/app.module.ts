import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListadoSiniestrosComponent } from './siniestros/listado-siniestros/listado-siniestros.component';

@NgModule({
  declarations: [
    AppComponent,    
    ListadoSiniestrosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
