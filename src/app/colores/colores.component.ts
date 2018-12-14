import { CoreService } from 'ac-core';

import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';

@Component({
    selector: 'lfa-colores',
    templateUrl: './colores.component.html',
    styleUrls: ['./colores.component.scss']
})
export class ColoresComponent implements OnInit {
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
                title: 'Color',
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

    loadGrid(){
        this.proxy.getColores().subscribe(d => {
            if (d) {
                this.data = d;
                this.source.load(this.data);
            }
        });
    }

    onDeleteConfirm(event): void {
        console.log(event);
        if (window.confirm('¿Esta seguro que desea eliminar el registro seleccionado?')) {
            console.log(event.data.color_id);

            //this.proxy.deletePais(event.data.pais_id)
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
        this.router.navigate(['color', event.data.color_id]);
    }

    create() {
        this.router.navigate(['color']);
    }
}
