import Swal, { SweetAlertResult } from "sweetalert2";

export class Alerta {
  public static mostrarError(mensaje: string): void {
    Swal.fire({
      title: mensaje,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  public static async mostrarPregunta(mensaje: string): Promise<SweetAlertResult> {
    let alerta: Promise<SweetAlertResult> = Swal.fire({
      title: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });

    return await alerta;
  }
}