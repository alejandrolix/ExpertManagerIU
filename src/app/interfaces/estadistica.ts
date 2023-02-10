interface Detalle {
    nombreAseguradora: string;
    numSiniestros: number;
}

export interface Estadistica {
    numSiniestros: number;
    numSiniestrosCerrarPorAseguradora: Detalle[];
    numSiniestrosPorAseguradora: Detalle[];
}
