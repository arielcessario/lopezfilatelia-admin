import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';
import { CoreService } from 'ac-core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { Location } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';


@Component({
    selector: 'lfa-usuariolote',
    templateUrl: './usuariolote.component.html',
    styleUrls: ['./usuariolote.component.scss'],
    providers: [
        //{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }
    ]
})
export class UsuarioLoteComponent implements OnInit {

    private toasterService: ToasterService;

    id = -1;
    err: string;

    estampillas: Array<any> = [];

    public nombre = '';
    public fecha_inicio = '';
    public fecha_fin = '';
    public precio = '';
    public cliente = '';
    public fecha_oferta = '';
    public mayor_oferta = '';
    public imagen = 'no_image.png';


    imagesPath = environment.imagesPath;


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
            estampilla_id: {
                title: 'estampilla_id',
                type: 'string'
            },
            nombre: {
                title: 'Estampilla',
                type: 'string'
            },
            anio: {
                title: 'Anio',
                type: 'string'
            },
            variedad: {
                title: 'Variedad',
                type: 'string'
            }
        }
    };

    settings1 = {
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
                title: 'apellido',
                type: 'string'
            },
            nombre: {
                title: 'nombre',
                type: 'string'
            },
            mail: {
                title: 'mail',
                type: 'string'
            },
            precio: {
                title: 'precio',
                type: 'string'
            },
            fecha_oferta: {
                title: 'fecha_oferta',
                type: 'string'
            }
        }
    };

    allRows: Array<any> = [];
    source: LocalDataSource = new LocalDataSource();
    data = [];

    allRows1: Array<any> = [];
    source1: LocalDataSource = new LocalDataSource();
    data1 = [];

    constructor(
        private coreService: CoreService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private proxy: LopezfilateliaAdminProxy,
        toasterService: ToasterService) {

        this.toasterService = toasterService;

    }

    ngOnInit() {
        this.route.params.subscribe((p: { id: number }) => {
            if (p.id) {
                this.id = p.id;
                this.proxy.getUsuariosLote(this.id).subscribe(e => {
                    console.log(e);
                    this.nombre = e.nombre;
                    this.fecha_inicio = e.fecha_inicio.replace('00:00:00', '');
                    this.fecha_fin = e.fecha_fin.replace('23:59:59', '');
                    this.precio = e.precio;
                    this.cliente = e.cliente;
                    this.mayor_oferta = e.mayor_oferta;
                    this.fecha_oferta = e.fecha_oferta;

                    this.data = e.estampillas;
                    this.source.load(this.data);

                    this.data1 = e.ofertas;
                    this.source1.load(this.data1);

                });
            }
        });
    }

    submit() {

    }

    cancel() {
        this.router.navigate(['usuarioslotes']);
    }


    onActivate(e) {
        console.log(e);
    }



}
