import { DetalleEstadistica } from './detalleEstadistica';

export interface Estadistica {
    numSiniestros: number;
    numSiniestrosCerrarPorAseguradora: DetalleEstadistica[];
    numSiniestrosPorAseguradora: DetalleEstadistica[];
}