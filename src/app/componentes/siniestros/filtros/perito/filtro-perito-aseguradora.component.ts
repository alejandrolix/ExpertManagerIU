import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatosFiltroPeritoYAseguradoraDTO, NombreDesplegableFiltro } from 'src/app/interfaces/DTOs/filtro-perito-y-aseguradora';
import { PeritoFiltroDto } from 'src/app/interfaces/DTOs/perito-filtro-dto';
import { PeritoSiniestroDto } from 'src/app/interfaces/DTOs/perito-siniestro-dto';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { AseguradoraSiniestroDto } from 'src/app/interfaces/DTOs/aseguradora-siniestro-dto';
import { AseguradoraFiltroDto } from 'src/app/interfaces/DTOs/aseguradora-filtro-dto';

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
  public desplegableSeleccionadoEnum: typeof NombreDesplegableFiltro = NombreDesplegableFiltro;

  @Output()
  public emisorPeritoYAseguradora: EventEmitter<DatosFiltroPeritoYAseguradoraDTO> = new EventEmitter<DatosFiltroPeritoYAseguradoraDTO>();

  constructor() { }

  public eliminarFiltros(): void {
    this.idPeritoSeleccionado = '0';
    this.idAseguradoraSeleccionada = '0';
    this.enviarPeritoYAseguradoraSeleccionada(NombreDesplegableFiltro.Ninguno);
  }

  public enviarPeritoYAseguradoraSeleccionada(nombreDesplegable: NombreDesplegableFiltro): void {
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
      idAseguradora,
      nombreDesplegable: nombreDesplegable
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

    let aseguradorasUnicas: AseguradoraFiltroDto[] = [];

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
