import { CrearSiniestroDto } from "src/app/interfaces/DTOs/crear-siniestro-dto";

export interface EditarSiniestroDto extends CrearSiniestroDto {
    idEstado: number;
    impValoracionDanios: string;
}
