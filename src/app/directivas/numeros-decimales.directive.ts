import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumerosDecimales]'
})
export class NumerosDecimalesDirective {
  constructor(private campoTexto: ElementRef<HTMLInputElement>) { }

  @HostListener('keydown', ['$event']) comprobarTeclaPulsada(evento: KeyboardEvent): void {
    let teclaPulsada: string = evento.key;
    let caracteresPermitidos: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', ',', '.'];

    if (!caracteresPermitidos.includes(teclaPulsada))
      evento.preventDefault();

    let valorCampoTexto: string = this.campoTexto.nativeElement.value;

    if (valorCampoTexto.includes(',') || valorCampoTexto.includes('.')) {
      let separadorNumerosDecimales: string = ',';

      if (valorCampoTexto.includes('.'))
        separadorNumerosDecimales = '.';

      let cantidadComasOPuntos: number = valorCampoTexto.split(separadorNumerosDecimales).length;

      if (cantidadComasOPuntos >= 3) {
        evento.preventDefault();
        return;
      }

      let parteDecimal: string = valorCampoTexto.split(separadorNumerosDecimales)[1];

      if (parteDecimal.length >= 2)
        evento.preventDefault();
    }
  }
}
