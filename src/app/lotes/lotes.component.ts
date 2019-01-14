import { CoreService } from 'ac-core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';
import { ToasterService } from 'angular2-toaster';



@Component({
    selector: 'lfa-lotes',
    templateUrl: './lotes.component.html',
    styleUrls: ['./lotes.component.scss']
})
export class LotesComponent implements OnInit {

    private toasterService: ToasterService;

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
            fecha_inicio: {
                title: 'Fecha Inicio',
                type: 'string'
            },
            fecha_fin: {
                title: 'Fecha Fin',
                type: 'string'
            },
            precio: {
                title: 'Precio',
                type: 'string'
            },
            status_nombre: {
                title: 'Estado',
                type: 'string'
            },
        }
    };

    allRows: Array<any> = [];
    source: LocalDataSource = new LocalDataSource();
    data = [];

    constructor(
        private router: Router,
        private coreService: CoreService,
        private proxy: LopezfilateliaAdminProxy,
        toasterService: ToasterService) {

        this.toasterService = toasterService;

    }

    ngOnInit() {
        this.loadGrid();
    }

    loadGrid() {
        this.proxy.getLotes().subscribe(d => {
            if (d) {
                this.data = d;
                this.source.load(this.data);
            }
        });
    }

    onDeleteConfirm(event): void {
        if (event.data.status === 1 || event.data.status === 4) {
            if (window.confirm('¿Esta seguro que desea eliminar el registro seleccionado?')) {
              this.proxy.deleteLote(event.data.lote_id)
                  .subscribe(r => {
                      this.loadGrid();
                  });
            }
        } else if (event.data.status === 2) {
            this.toasterService.pop('warning', 'Advertencia', 'No se puede eliminar un Lote Vendido');
        } else {
            this.toasterService.pop('warning', 'Advertencia', 'No se puede eliminar un Lote Finalizado');
        }
    }

    update(event): void {
        if (event.data.status === 1 || event.data.status === 4) {
            this.router.navigate(['lote', event.data.lote_id]);
        } else if (event.data.status === 2) {
            this.toasterService.pop('warning', 'Advertencia', 'No se puede modificar un Lote Vendido');
        } else {
            this.toasterService.pop('warning', 'Advertencia', 'No se puede modificar un Lote Finalizado');
        }
    }

    create() {
        this.router.navigate(['lote']);
    }
}
