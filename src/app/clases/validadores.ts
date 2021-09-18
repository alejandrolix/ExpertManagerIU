import { AbstractControl } from "@angular/forms";

export class Validadores {
    public static comprobarContraseniasSonIguales(control: AbstractControl): { [key: string]: any } | null {
        if (control.value && (control.value !== control.parent?.get('contrasenia')?.value))
            return {
                contraseniasNoIguales: true
            };

        return null;
    }
}
