export interface DatosFiltroPeritoYAseguradoraDTO {
    idPerito: number,
    idAseguradora: number,
    nombreDesplegable: NombreDesplegableFiltro
}

export enum NombreDesplegableFiltro {
    Aseguradora,
    Perito,
    Ninguno
}
