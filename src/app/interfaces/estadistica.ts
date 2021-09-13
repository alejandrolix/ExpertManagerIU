interface DetalleEstadistica {
    nombreAseguradora: string;
    numSiniestros: number;
}

export interface Estadistica {
    numSiniestros: number;
    numSiniestrosCerrarPorAseguradora: DetalleEstadistica[];
    numSiniestrosPorAseguradora: DetalleEstadistica[];
}
