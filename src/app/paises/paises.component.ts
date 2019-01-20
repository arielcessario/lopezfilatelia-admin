import { CoreService } from 'ac-core';

import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';

@Component({
    selector: 'lfa-paises',
    templateUrl: './paises.component.html',
    styleUrls: ['./paises.component.scss']
})
export class PaisesComponent implements OnInit {
    settings = {
        mode: 'external',
        actions: {
            delete: false
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
                title: 'País',
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
        private proxy: LopezfilateliaAdminProxy
    ) {}

    ngOnInit() {
        this.loadGrid();
    }

    loadGrid() {
        this.proxy.getPaises().subscribe(d => {
            if (d) {
                this.data = d;
                this.source.load(this.data);
            }
        });
    }

    onDeleteConfirm(event): void {
        console.log(event);
        if (window.confirm('¿Esta seguro que desea eliminar el registro seleccionado?')) {
            console.log(event.data.pais_id);

            // this.proxy.deletePais(event.data.pais_id)
            //    .subscribe(r => {
            //        //this.data.splice(encontrado, 1);
            //        //this.source.load(this.data);
            //        this.loadGrid();
            //    });
        } else {
            // event.confirm.reject();
        }
    }

    update(event): void {
        this.router.navigate(['pais', event.data.pais_id]);
    }

    create() {
        this.router.navigate(['pais']);
    }
}
