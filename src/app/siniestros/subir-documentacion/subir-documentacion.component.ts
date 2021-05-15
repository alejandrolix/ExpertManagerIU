import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subir-documentacion',
  templateUrl: './subir-documentacion.component.html',
  styleUrls: ['./subir-documentacion.component.scss']
})
export class SubirDocumentacionComponent implements OnInit {
  public formSubirDocumentacion: FormGroup;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    let idSiniestro: number = Number(this.route.snapshot.paramMap.get('id'));
    this.formSubirDocumentacion = new FormGroup({
      descripcion: new FormControl('', Validators.required)
    });
  }

  public irAtras(): void {
    history.back();
  }

  public enviar(): void {

  }
}
