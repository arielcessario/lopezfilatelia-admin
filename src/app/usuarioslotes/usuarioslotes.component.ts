import { CoreService } from 'ac-core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';

@Component({
    selector: 'lfa-usuarioslotes',
    templateUrl: './usuarioslotes.component.html',
    styleUrls: ['./usuarioslotes.component.scss']
})
export class UsuariosLotesComponent implements OnInit {
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
            lote_id: {
                title: 'N° Lote',
                type: 'string'
            },
            nombre: {
                title: 'Nombre del Lote',
                type: 'string'
            },
            precio: {
                title: 'Precio Base',
                type: 'string'
            },
            cantidad: {
                title: 'Cant. Ofertas',
                type: 'string'
            },
            max_precio: {
                title: 'Mejor Oferta',
                type: 'string'
            },
            status_nombre: {
                title: 'Estado del Lote',
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
        this.proxy.getLotesUsuarios().subscribe(data => {
            if (data) {
                this.data = data;
                this.source.load(this.data);
            }
        });
    }


    update(event): void {
        this.router.navigate(['usuariolote', event.data.lote_id]);
    }

    create() {
        this.router.navigate(['usuariolote']);
    }
}
