import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Alerta } from 'src/app/clases/Alerta';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { DatosFiltroPeritoYAseguradoraDTO } from 'src/app/interfaces/DTOs/filtro-perito-y-aseguradora';
import { Usuario } from 'src/app/interfaces/usuario';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';
import { PeritosService } from 'src/app/servicios/peritos.service';

@Component({
  selector: 'app-filtro-perito-aseguradora',
  templateUrl: './filtro-perito-aseguradora.component.html',
  styleUrls: ['./filtro-perito-aseguradora.component.scss']
})
export class FiltroPeritoAseguradoraComponent implements OnInit {
  @Input()
  public tienePermisoAdministracion: boolean = true;

  public idPeritoSeleccionado: string;
  public idAseguradoraSeleccionada: string;
  public peritos: Usuario[];
  public aseguradoras: Aseguradora[];

  @Output()
  public emisorPeritoYAseguradora: EventEmitter<DatosFiltroPeritoYAseguradoraDTO> = new EventEmitter<DatosFiltroPeritoYAseguradoraDTO>();

  constructor(private peritosService: PeritosService, private aseguradorasService: AseguradorasService) { }

  async ngOnInit(): Promise<void> {
    try {
        this.peritos = await this.peritosService.obtenerTodos()
                                                .toPromise();
      } catch (error: any) {
        Alerta.mostrarError(error);

        return;
      }

      this.peritos.unshift({
        id: 0,
        nombre: 'Todos',
        idEsPerito: 0,
        esPerito: '',
        idPermiso: 0,
        permiso: '',
        contrasenia: '',
        impReparacionDanios: 0,
        token: ''
      });

      this.idPeritoSeleccionado = '0';

      try {
        this.aseguradoras = await this.aseguradorasService.obtenerTodas()
                                                          .toPromise();
      } catch (error: any) {
        Alerta.mostrarError(error);

        return;
      }

      this.aseguradoras.unshift({
        id: 0,
        nombre: 'Todas'
      });

      this.idAseguradoraSeleccionada = '0';
  }

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
}
