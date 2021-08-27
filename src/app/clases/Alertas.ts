import Swal from "sweetalert2";

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
}