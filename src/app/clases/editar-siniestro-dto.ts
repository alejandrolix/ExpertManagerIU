import { CrearSiniestroDto } from "./crear-siniestro-dto";

export class EditarSiniestroDto extends CrearSiniestroDto {
    public idEstado: number;
    public impValoracionDanios: string;
}
