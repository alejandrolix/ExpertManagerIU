import { CrearSiniestroDto } from "src/app/interfaces/DTOs/siniestro/crear-siniestro-dto";

export interface EditarSiniestroDto extends CrearSiniestroDto {
    idEstado: number;
    impValoracionDanios: number;
}
