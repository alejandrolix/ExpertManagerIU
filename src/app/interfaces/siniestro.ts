export interface Siniestro {
    id: number;
    idEstado: number;
    estado: string;
    idAseguradora: number;
    aseguradora: string;
    direccion: string;
    descripcion: string;
    idPerito: number;
    perito: string;
    fechaHoraAlta: Date;
    idSujetoAfectado: number;
    sujetoAfectado: string;
    idDanio: number;
    danio: string;
    impValoracionDanios: string;
}
