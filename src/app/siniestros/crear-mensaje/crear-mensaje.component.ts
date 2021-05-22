import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crear-mensaje',
  templateUrl: './crear-mensaje.component.html',
  styleUrls: ['./crear-mensaje.component.scss']
})
export class CrearMensajeComponent implements OnInit {
  public formCrearMensaje: FormGroup;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    let idSiniestro: number = Number(this.route.snapshot.paramMap.get('id'));

    this.formCrearMensaje = new FormGroup({
      descripcion: new FormControl('', Validators.required)
    });
  }

  public crear(): void {
    
  }
}
