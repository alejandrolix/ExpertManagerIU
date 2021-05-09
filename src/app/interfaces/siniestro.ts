export interface Siniestro {
    id: number;
    estado: string;
    aseguradora: string;
    descripcion: string;
    perito: string;
    fechaHoraAlta: Date;
    sujetoAfectado: string;
    impValoracionDanios: number;
}
