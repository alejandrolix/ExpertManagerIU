import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumerosDecimales]'
})
export class NumerosDecimalesDirective {
  private expresionNumerosDecimales: RegExp;
  private teclasPermitidas: string[];

  constructor(private campoTexto: ElementRef<HTMLInputElement>) {
    this.expresionNumerosDecimales = new RegExp(/^\d+([,.])?(\d{1,2})?$/);
    this.teclasPermitidas = ["ArrowLeft", "ArrowRight", "Delete", "Backspace", "Home", "End"];
  }

  @HostListener("keydown", ["$event"]) comprobarTeclaPulsada(evento: KeyboardEvent): void {
    let teclaPulsada: string = evento.key;
    let textoCampoMasTeclaPulsada: string = `${this.campoTexto.nativeElement.value}${teclaPulsada}`;

    if (this.expresionNumerosDecimales.test(textoCampoMasTeclaPulsada))
      return;

    if (!this.teclasPermitidas.includes(teclaPulsada))
      evento.preventDefault();
  }
}
