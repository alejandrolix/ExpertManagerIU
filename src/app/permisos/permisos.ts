export class Permisos {
    public static esPermisoAdministracion(): boolean {
        let idPermiso: string | null = localStorage.getItem('idPermiso');

        if (idPermiso == null)
            return false;

        let idPermisoNumero: number = parseInt(idPermiso);

        if (idPermisoNumero == 1)
            return true;
        else
            return false;
    }
}
