import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatosFiltroPeritoYAseguradoraDTO } from 'src/app/interfaces/DTOs/filtro-perito-y-aseguradora';
import { Siniestro } from 'src/app/interfaces/siniestro';

@Component({
  selector: 'app-filtro-perito-aseguradora',
  templateUrl: './filtro-perito-aseguradora.component.html',
  styleUrls: ['./filtro-perito-aseguradora.component.scss']
})
export class FiltroPeritoAseguradoraComponent {
  @Input()
  public tienePermisoAdministracion: boolean = true;

  public idPeritoSeleccionado: string;
  public idAseguradoraSeleccionada: string;
  public peritos: {id: number, nombre: string}[];
  public aseguradoras: {id: number, nombre: string}[];

  @Output()
  public emisorPeritoYAseguradora: EventEmitter<DatosFiltroPeritoYAseguradoraDTO> = new EventEmitter<DatosFiltroPeritoYAseguradoraDTO>();

  constructor() { }

  public eliminarFiltros(): void {
    this.idPeritoSeleccionado = '0';
    this.idAseguradoraSeleccionada = '0';
    this.enviarPeritoYAseguradoraSeleccionada();
  }

  public enviarPeritoYAseguradoraSeleccionada(): void {
    let idPerito = parseInt(this.idPeritoSeleccionado);
    let idAseguradora = parseInt(this.idAseguradoraSeleccionada);

    this.emisorPeritoYAseguradora.emit({
      idPerito,
      idAseguradora
    });
  }

  public asignarPeritos(siniestros: Siniestro[]): void {
    let peritos: {idPerito: number, perito: string}[] = siniestros.map((siniestro: Siniestro) => {
      let {idPerito, perito}: {idPerito: number, perito: string} = siniestro;

      return {
        idPerito,
        perito
      };
    });

    let peritosUnicos: {id: number, nombre: string}[] = [];

    peritos.forEach((perito: {idPerito: number, perito: string}) => {
      let peritoUnico = peritosUnicos.find(peritoUnico => {
        if (perito.idPerito === peritoUnico.id) {
          return true;
        }

        return false;
      });

      if (peritoUnico === undefined) {
        peritosUnicos.push({
          id: perito.idPerito,
          nombre: perito.perito
        });
      }
    });

    this.peritos = peritosUnicos;
    this.peritos.unshift({
      id: 0,
      nombre: 'Todos'
    });

    this.idPeritoSeleccionado = '0';
  }

  public asignarAseguradoras(siniestros: Siniestro[]): void {
    let aseguradoras: {idAseguradora: number, aseguradora: string}[] = siniestros.map((siniestro: Siniestro) => {
      let {idAseguradora, aseguradora}: {idAseguradora: number, aseguradora: string} = siniestro;

      return {
        idAseguradora,
        aseguradora
      };
    });

    let aseguradorasUnicas: {id: number, nombre: string}[] = [];

    aseguradoras.forEach((aseguradora: {idAseguradora: number, aseguradora: string}) => {
      let encontrado = aseguradorasUnicas.find(aseguradoraUnica => {
        if (aseguradora.idAseguradora === aseguradoraUnica.id) {
          return true;
        }

        return false;
      });

      if (encontrado === undefined) {
        aseguradorasUnicas.push({
          id: aseguradora.idAseguradora,
          nombre: aseguradora.aseguradora
        });
      }
    });

    this.aseguradoras = aseguradorasUnicas;
    this.aseguradoras.unshift({
      id: 0,
      nombre: 'Todas'
    });

    this.idAseguradoraSeleccionada = '0';
  }
}
