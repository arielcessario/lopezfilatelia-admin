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
import { ToasterService } from 'angular2-toaster';


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

    private toasterService: ToasterService;

    form: FormGroup;
    private fb: FormBuilder;
    lote: any;
    id = -1;
    accion = 'Crear';
    err: string;

    estampillas: Array<any> = [];

    public nombre = '';
    public fecha_inicio: any = {};
    public fecha_fin: any = {};
    public hora_inicio: any = {};
    public hora_fin: any = {};
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
        private proxy: LopezfilateliaAdminProxy,
        toasterService: ToasterService) {

        this.toasterService = toasterService;

    }

    ngOnInit() {
        this.route.params.subscribe((p: { id: number }) => {
            if (p.id) {
                this.accion = 'Modificar';
                this.id = p.id;
                this.proxy.getLote(this.id).subscribe(e => {
                    this.lote = e;
                    console.log(this.lote);
                    this.buildForm();
                });
            } else {
                this.accion = 'Nuevo';
                this.buildForm();
            }
        });


        //this.hora_fin = {hour: 10, minute: 00};
        this.hora_inicio = {hour: 10, minute: 0};
    }

    submit() {
        const plu = {
            id: this.id,
            lote_id: this.id,
            nombre: this.form.get('nombre').value,
            precio: this.form.get('precio').value,
            fecha_inicio: this.fecha_inicio,
            fecha_fin: this.fecha_fin,
            hora_inicio: this.hora_inicio,
            hora_fin: this.hora_fin,
            estampillas: this.estampillas
        };

        console.log(this.fecha_inicio );
        console.log(this.hora_inicio);
        console.log('guardar', plu);

        if(plu.estampillas.length > 0) {
            if(plu.id > 0) {
                this.proxy.updateLote(plu).subscribe( data => {
                        this.toasterService.pop("success", "Exito", "Se actualizo el lote satisfactoriamente");
                        this.router.navigate(['lotes']);
                    }, error => {
                        this.err = error;
                    }
                );
            } else {
                this.proxy.createLote(plu).subscribe( data => {
                        this.toasterService.pop("success", "Exito", "Se creó el lote satisfactoriamente");
                        this.router.navigate(['lotes']);
                    }, error => {
                        this.err = error;
                    }
                );
            }
        }
        else {
            this.toasterService.pop("warning", "Advertencia", "Debe agregar estampillas al lote");
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
            //fecha_inicio: [this.fecha_inicio, [Validators.required]],
            //fecha_fin: [this.fecha_fin, [Validators.required]],
            precio: [this.precio, [Validators.required]],
        };

        this.fb = new FormBuilder();
        const form = this.fb.group(group);

        form.controls['nombre'].setValue('');
        form.controls['precio'].setValue('');
        this.fecha_inicio = {};
        this.fecha_fin = {};
        this.hora_inicio = {};
        this.hora_fin = {};

        if (this.id !== -1) {
            console.log(this.lote[0]);
            form.controls['nombre'].setValue(this.lote[0].nombre);
            form.controls['precio'].setValue(this.lote[0].precio);

            var aux1 = new Date(this.lote[0].fecha_inicio);
            var aux2 = new Date(this.lote[0].fecha_fin);
            this.fecha_inicio = { year: aux1.getFullYear(), month: aux1.getMonth() + 1, day: aux1.getDate() };
            this.hora_inicio = { hour: aux1.getHours(), minute: aux1.getMinutes(), second: 0 };
            this.fecha_fin = { year: aux2.getFullYear(), month: aux2.getMonth() + 1, day: aux2.getDate() };
            this.hora_fin = { hour: aux2.getHours(), minute: aux2.getMinutes(), second: 0 };

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
                    this.toasterService.pop("warning", "Advertencia", "No existe el codigo ingresado");
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
                    this.toasterService.pop("warning", "Advertencia", "No existe el codigo ingresado");
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
