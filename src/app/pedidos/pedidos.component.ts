import { CoreService } from 'ac-core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'lfa-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
  providers: [
    DatePipe
  ]
})
export class PedidosComponent implements OnInit {
  settings = {
    mode: 'external',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: false
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
      carrito_id: {
        title: 'N° Pedido',
        type: 'string'
      },
      apellido: {
        title: 'Apellido',
        type: 'string'
      },
      nombre: {
        title: 'Nombre',
        type: 'string'
      },
      fecha: {
        title: 'Fecha del Pedido',
        type: 'string',
        valuePrepareFunction: (fecha) => {
          return this.datePipe.transform(new Date(fecha), 'dd/MM/yyyy HH:mm:ss');
        }
      },
      precio: {
        title: 'Total del Pedido',
        type: 'string'
      },
      status_name: {
        title: 'Estado del Pedido',
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
    private datePipe: DatePipe,
    private proxy: LopezfilateliaAdminProxy) {

    }

  ngOnInit() {
    this.loadGrid();
  }

  loadGrid() {
    this.proxy.getPedidos().subscribe(data => {
      if (data) {
        this.data = data;
        this.source.load(this.data);
      }
    });
  }


  update(event): void {
    this.router.navigate(['pedido', event.data.carrito_id]);
  }

  create() {
    this.router.navigate(['pedido']);
  }
}
