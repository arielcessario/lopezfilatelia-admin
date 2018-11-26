import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';
import { CoreService } from 'ac-core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import {
    NgbDatepickerConfig,
    NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
//import { NgbDateFRParserFormatter } from '../core/ngb-date-fr-parser-formatter';


import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
    FormArray,
    ValidatorFn
} from '@angular/forms';
import { Location } from '@angular/common';

@Component({
    selector: 'lfa-lote',
    templateUrl: './lote.component.html',
    styleUrls: ['./lote.component.scss'],
    providers: [
        //{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }
    ]
})
export class LoteComponent implements OnInit {

    form: FormGroup;
    private fb: FormBuilder;
    lote: any;
    id = -1;
    accion = 'Crear';
    err: string;

    estampillas: Array<any> = [];

    public nombre = '';
    public fecha_inicio = '';
    public fecha_fin = '';
    public precio = '';
    public codigo_yt = "";
    public codigo_arg = "";


    formErrors: any = {
        lote_id: '',
        nombre: '',
    };

    validationMessages = {
        nombre: {
            required: 'Requerido',
            minlength: 'El nombre debe tener más de 10 letras o números'
        }
    };

    constructor(
        private coreService: CoreService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private proxy: LopezfilateliaAdminProxy
    ) {}

    ngOnInit() {
        this.route.params.subscribe((p: { id: number }) => {
            if (p.id) {
                this.accion = 'Modificar';
                this.id = p.id;
                this.proxy.getLote(this.id).subscribe(e => {
                    this.lote = e;
                    this.buildForm();
                });
            } else {
                this.accion = 'Nuevo';
                this.buildForm();
            }
        });

        //var estampilla1 = {estampilla_id: 1, codigo_yt: 12, codigo_arg: 123, nombre: "test 1"};
        //this.estampillas.push(estampilla1);
        //
        //var estampilla2 = {estampilla_id: 2, codigo_yt: 22, codigo_arg: 1.23, nombre: "test 2"};
        //this.estampillas.push(estampilla2);
    }

    submit() {
        const plu = {
            id: this.id,
            lote_id: this.id,
            nombre: this.form.get('nombre').value,
            fecha_inicio: this.form.get('fecha_inicio').value,
            fecha_fin: this.form.get('fecha_fin').value,
            precio: this.form.get('precio').value,
            estampillas: this.estampillas
        };

        console.log('guardar', plu);

        if(plu.estampillas.length > 0) {
            if(plu.id > 0) {
                this.proxy.updateLote(plu).subscribe( data => {
                        this.router.navigate(['lotes']);
                    }, error => {
                        this.err = error;
                    }
                );
            } else {
                this.proxy.createLote(plu).subscribe( data => {
                        this.router.navigate(['lotes']);
                    }, error => {
                        this.err = error;
                    }
                );
            }
        }
        else {
            alert("Debe agregar estampillas al lote");
        }

    }

    cancel() {
        this.router.navigate(['lotes']);
    }


    buildForm() {
        const group: any = {
            nombre: [
                this.nombre,
                [
                    Validators.required,
                    Validators.minLength(15),
                    Validators.maxLength(15)
                ]
            ],
            fecha_inicio: [this.fecha_inicio, [Validators.required]],
            fecha_fin: [this.fecha_fin, [Validators.required]],
            precio: [this.precio, [Validators.required]],
        };

        this.fb = new FormBuilder();
        const form = this.fb.group(group);

        form.controls['nombre'].setValue('');
        form.controls['fecha_inicio'].setValue('');
        form.controls['fecha_fin'].setValue('');
        form.controls['precio'].setValue('');

        if (this.id !== -1) {
            form.controls['nombre'].setValue(this.lote[0].nombre);
            form.controls['fecha_inicio'].setValue(this.lote[0].fecha_inicio);
            form.controls['fecha_fin'].setValue(this.lote[0].fecha_fin);
            form.controls['precio'].setValue(this.lote[0].precio);

            var aux = this.lote["estampillas"];
            var temp = new Array();

            aux.forEach(function(element) {
                console.log(element);
                temp.push({
                    estampilla_id: element.estampilla_id,
                    codigo_yt: element.codigo_yt,
                    codigo_arg: element.codigo_arg,
                    nombre: element.nombre
                });
            });

            this.estampillas = temp;

        }

        this.form = form;
    }

    onActivate(e) {
        console.log(e);
    }


    searchYT() {
        this.proxy.buscarEstampillas().subscribe(data => {
            if (data) {
                let encontrado = false;
                for (var i = 0; i < data.length; i++) {
                    if (this.codigo_yt == data[i].codigo_yt) {
                        var aux = {estampilla_id: data[i].estampilla_id, codigo_yt: data[i].codigo_yt, codigo_arg: data[i].codigo_arg, nombre: data[i].nombre};
                        this.estampillas.push(aux);
                        this.codigo_yt = "";
                        encontrado = true;
                    }
                }
                if(!encontrado) {
                    alert("No existe el codigo ingresado");
                }
            }
        });
    }

    searchArg() {
        this.proxy.buscarEstampillas().subscribe(data => {
            if (data) {
                let encontrado = false;
                for (var i = 0; i < data.length; i++) {
                    if (this.codigo_arg == data[i].codigo_arg) {
                        var aux = {estampilla_id: data[i].estampilla_id, codigo_yt: data[i].codigo_yt, codigo_arg: data[i].codigo_arg, nombre: data[i].nombre};
                        this.estampillas.push(aux);
                        this.codigo_arg = "";
                        encontrado = true;
                    }
                }
                if(!encontrado) {
                    alert("No existe el codigo ingresado");
                }
            }
        });
    }

    quitarEstampilla(item) {
        for (var i = 0; i < this.estampillas.length; i++) {
            if (item.estampilla_id == this.estampillas[i].estampilla_id) {
                this.estampillas.splice(i, 1);
            }
        }
    }

}
