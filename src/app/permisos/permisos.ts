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

    public static esPermisoPeritoNoResponsable(): boolean {
        let idPermiso: string | null = localStorage.getItem('idPermiso');

        if (idPermiso == null)
            return false;

        let idPermisoNumero: number = parseInt(idPermiso);

        if (idPermisoNumero == 3)
            return true;
        else
            return false;
    }
}
