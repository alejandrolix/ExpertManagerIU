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
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  public static async mostrarErrorAsincrono(mensaje: string): Promise<void> {
    await Swal.fire({
      title: mensaje,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      icon: 'error',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  public static async mostrarPreguntaAsincrono(mensaje: string): Promise<SweetAlertResult> {
    let alerta: Promise<SweetAlertResult> = Swal.fire({
      title: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    return await alerta;
  }

  public static async mostrarOkAsincrono(mensaje: string): Promise<SweetAlertResult> {
    let alerta: Promise<SweetAlertResult> = Swal.fire({
      title: mensaje,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      icon: 'success',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    return await alerta;
  }
}