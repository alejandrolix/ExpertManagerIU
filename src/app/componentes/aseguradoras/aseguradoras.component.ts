import { Component, computed, signal, Signal, WritableSignal } from '@angular/core';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SweetAlertResult } from 'sweetalert2';
import { Alerta } from 'src/app/clases/Alerta';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-aseguradoras',
  templateUrl: './aseguradoras.component.html',
  styleUrls: ['./aseguradoras.component.scss']
})
export class AseguradorasComponent {
  private _aseguradoras: Signal<Aseguradora[]>;
  public aseguradoras: Signal<WritableSignal<Aseguradora[]>>;

  constructor(private aseguradorasService: AseguradorasService) {
    this._aseguradoras = toSignal(this.aseguradorasService.obtenerTodas(), {
      initialValue: []
    });
    this.aseguradoras = computed(() => signal(this._aseguradoras()));
  }

  public crear(): void {

  }

  public editar(id: number): void {

  }

  public async eliminar(id: number): Promise<void> {
    let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea eliminar la aseguradora con id ${id}?`);

    if (!accionPregunta.isConfirmed) {
      return;
    }

    await firstValueFrom(this.aseguradorasService.eliminar(id));
    await Alerta.mostrarOkAsincrono('Aseguradora eliminada correctamente');
    
    let nuevasAseguradoras: Aseguradora[] = this._aseguradoras().filter((aseguradora: Aseguradora) => aseguradora.id !== id);
    this.aseguradoras().set(nuevasAseguradoras);
  }
}
