import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Documentacion } from 'src/app/interfaces/documentacion';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { DocumentacionesService } from 'src/app/servicios/documentaciones.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';

@Component({
  selector: 'app-detalles-siniestro',
  templateUrl: './detalles-siniestro.component.html',
  styleUrls: ['./detalles-siniestro.component.scss']
})
export class DetallesSiniestroComponent implements OnInit {
  public siniestro: Siniestro;
  public documentaciones: Documentacion[];

  constructor(private route: ActivatedRoute, private siniestrosService: SiniestrosService, private documentacionesService: DocumentacionesService) { }

  async ngOnInit(): Promise<void> {
    let idSiniestro: number = Number(this.route.snapshot.paramMap.get('id'));
    this.siniestro = await this.siniestrosService.obtenerPorId(idSiniestro).toPromise();
    this.documentaciones = await this.documentacionesService.obtenerPorIdSiniestro(idSiniestro).toPromise();
  }

  async verArchivo(id: number): Promise<void> {
    let pdf: Blob = await this.documentacionesService.obtener(id).toPromise();
    
    const urlPdf = URL.createObjectURL(pdf);
    window.open(urlPdf, '_blank');
  }
}
