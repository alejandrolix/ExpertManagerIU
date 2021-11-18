import { CrearSiniestroDto } from "src/app/clases/DTOs/crear-siniestro-dto";

export interface EditarSiniestroDto extends CrearSiniestroDto {
    idEstado: number;
    impValoracionDanios: string;
}
