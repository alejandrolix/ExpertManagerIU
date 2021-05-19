import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {
  public usuarios: Usuario[];

  constructor(private router: Router, private usuariosService: UsuariosService) { }

  async ngOnInit(): Promise<void> {
    this.usuarios = await this.usuariosService.obtenerTodos().toPromise();
  }

  public editar(id: number): void {
    
  }

  public async eliminar(id: number): Promise<void> {    
    
  } 

  public crear(): void {
    this.router.navigateByUrl('/crearUsuario');
  }
}
