import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/servicios/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {  

  constructor(private spinnerService: SpinnerService) { }

  get mostrarSpinner(): boolean {
    return this.spinnerService.mostrar;
  }

  ngOnInit(): void {
    this.spinnerService.mostrarSpinnerObs
                       .subscribe((mostrar: boolean) => this.spinnerService.mostrar = mostrar);
  }
}
