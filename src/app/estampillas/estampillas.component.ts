import { CoreService } from 'ac-core';

import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';

@Component({
  selector: 'lfa-estampillas',
  templateUrl: './estampillas.component.html',
  styleUrls: ['./estampillas.component.scss']
})
export class EstampillasComponent implements OnInit {
  settings = {
    mode: 'external',
    actions: {
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
      nombre: {
        title: 'Nombre',
        type: 'string'
      },
      pais: {
        title: 'País',
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
    this.proxy.getEstampillas().subscribe(d => {
      if (d) {
        this.data = d;
        this.source.load(this.data);
      }
    });
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      let encontrado = -1;
      for (let i = 0; i < this.data.length; i++) {
        if ('' + this.data[i].id === '' + event.data.id) {
          encontrado = i;
        }
      }

      if (encontrado > -1) {
        this.proxy
          .deleteEstampilla(this.data[encontrado].estampilla_id)
          .subscribe(r => {
            this.data.splice(encontrado, 1);
            this.source.load(this.data);
          });
      }
    } else {
      // event.confirm.reject();
    }
  }

  update(event): void {
    console.log(event);
    this.router.navigate(['estampilla', event.data.id]);
  }

  create() {
    this.router.navigate(['estampilla']);
  }
}
