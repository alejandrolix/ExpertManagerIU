import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';

@Component({
  selector: 'app-detalles-siniestro',
  templateUrl: './detalles-siniestro.component.html',
  styleUrls: ['./detalles-siniestro.component.scss']
})
export class DetallesSiniestroComponent implements OnInit {
  public siniestro: Siniestro;

  constructor(private route: ActivatedRoute, private siniestrosService: SiniestrosService) { }

  async ngOnInit(): Promise<void> {
    let idSiniestro: number = Number(this.route.snapshot.paramMap.get('id'));
    this.siniestro = await this.siniestrosService.obtenerPorId(idSiniestro).toPromise();
  }
}
