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
  public peritos: PeritoFiltroDto[];
  public aseguradoras: AseguradoraFiltroDto[];

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

    if (isNaN(idPerito)) {
      idPerito = 0;
    }

    if (isNaN(idAseguradora)) {
      idAseguradora = 0;
    }

    this.emisorPeritoYAseguradora.emit({
      idPerito,
      idAseguradora
    });
  }

  public asignarPeritos(siniestros: Siniestro[]): void {
    let peritos: PeritoSiniestroDto[] = siniestros.map((siniestro: Siniestro) => {
      let {idPerito, perito}: PeritoSiniestroDto = siniestro;

      return {
        idPerito,
        perito
      };
    });

    let peritosUnicos: PeritoFiltroDto[] = [];

    peritos.forEach((perito: PeritoSiniestroDto) => {
      let encontrado: PeritoFiltroDto | undefined = peritosUnicos.find((peritoUnico: PeritoFiltroDto) => {
        if (perito.idPerito === peritoUnico.id) {
          return true;
        }

        return false;
      });

      if (encontrado === undefined) {
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
    let aseguradoras: AseguradoraSiniestroDto[] = siniestros.map((siniestro: Siniestro) => {
      let {idAseguradora, aseguradora}: AseguradoraSiniestroDto = siniestro;

      return {
        idAseguradora,
        aseguradora
      };
    });

    let aseguradorasUnicas: {id: number, nombre: string}[] = [];

    aseguradoras.forEach((aseguradora: AseguradoraSiniestroDto) => {
      let encontrado: AseguradoraFiltroDto | undefined = aseguradorasUnicas.find((aseguradoraUnica: AseguradoraFiltroDto) => {
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

interface PeritoSiniestroDto {
  idPerito: number;
  perito: string;
}

abstract class PeritoFiltroDto {
  public id: number;
  public nombre: string;
}

interface AseguradoraSiniestroDto {
  idAseguradora: number;
  aseguradora: string;
}

abstract class AseguradoraFiltroDto extends PeritoFiltroDto { }