import { CoreService } from 'ac-core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';

@Component({
  selector: 'lfa-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  err: string;

  settings = {
    mode: 'external',
    actions: {
      add: true,
      edit: true,
      delete: true
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmEdit: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    columns: {
      apellido: {
        title: 'Apellido',
        type: 'string'
      },
      nombre: {
        title: 'Nombre',
        type: 'string'
      },
      mail: {
        title: 'Mail',
        type: 'string'
      },
      rol: {
        title: 'Rol',
        type: 'string'
      }
    }
  };

  allRows: Array<any> = [];
  source: LocalDataSource = new LocalDataSource();
  data = [];

  constructor(
    private router: Router,
    private coreService: CoreService,
    private proxy: LopezfilateliaAdminProxy
  ) {}

  ngOnInit() {
    this.loadGrid();
  }

  loadGrid() {
    this.proxy.getUsuarios().subscribe(
        data => {
            this.data = data;
            this.source.load(this.data);
        },
        error => {
          this.err = error;
        }
    );
  }

  onDeleteConfirm(event): void {
    /*
    if (window.confirm('¿Esta seguro que desea eliminar el usuario seleccionado?')) {
      this.proxy.deleteLote(event.data.usuario_id)
          .subscribe(r => {
              this.loadGrid();
          });
    }
    */
  }

  update(event): void {
    this.router.navigate(['usuario', event.data.usuario_id]);
  }

  create() {
    this.router.navigate(['usuario']);
  }
}
