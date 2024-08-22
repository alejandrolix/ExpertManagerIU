import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatosFiltroPeritoYAseguradoraDTO, NombreDesplegableFiltro } from 'src/app/interfaces/DTOs/filtro-perito-y-aseguradora';
import { PeritoFiltroDto } from 'src/app/interfaces/DTOs/perito/perito-filtro-dto';
import { AseguradoraFiltroDto } from 'src/app/interfaces/DTOs/aseguradora/aseguradora-filtro-dto';
import { PeritosService } from 'src/app/servicios/peritos.service';
import { firstValueFrom } from 'rxjs';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';

@Component({
  selector: 'app-filtro-perito-aseguradora',
  templateUrl: './filtro-perito-aseguradora.html',
  styleUrls: ['./filtro-perito-aseguradora.scss']
})
export class FiltroPeritoAseguradora {
  @Input()
  public tienePermisoAdministracion: boolean = true;

  public idPeritoSeleccionado: string;
  public idAseguradoraSeleccionada: string;
  public peritos: PeritoFiltroDto[];
  public aseguradoras: AseguradoraFiltroDto[];
  public desplegableSeleccionadoEnum: typeof NombreDesplegableFiltro = NombreDesplegableFiltro;

  @Output()
  public emisorPeritoYAseguradora: EventEmitter<DatosFiltroPeritoYAseguradoraDTO> = new EventEmitter<DatosFiltroPeritoYAseguradoraDTO>();

  constructor(private peritosService: PeritosService, private aseguradorasService: AseguradorasService) {
    this.cargarDatos();
  }

  private async cargarDatos(): Promise<void> {
    this.peritos = await firstValueFrom(this.peritosService.obtenerTodos());
    this.peritos.unshift({
      id: 0,
      nombre: 'Todos'
    });

    this.idPeritoSeleccionado = '0';

    this.aseguradoras = await firstValueFrom(this.aseguradorasService.obtenerTodas());
    this.aseguradoras.unshift({
      id: 0,
      nombre: 'Todas'
    });

    this.idAseguradoraSeleccionada = '0';
  }

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
      idAseguradora
    });
  }
}
