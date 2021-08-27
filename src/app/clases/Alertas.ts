import Swal from "sweetalert2";

export class Alertas {
    public static mostrarAlertaError(mensaje: string): void {
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