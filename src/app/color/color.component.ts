import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';
import { CoreService } from 'ac-core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
import { ToasterService } from 'angular2-toaster';


@Component({
    selector: 'lfa-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements OnInit {

    private toasterService: ToasterService;


    form: FormGroup;
    private fb: FormBuilder;
    color: any;
    id = -1;
    accion = 'Crear';
    err: string;

    public nombre = '';

    formErrors: any = {
        color_id: '',
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
        toasterService: ToasterService
    ) {
        this.toasterService = toasterService;

    }


    ngOnInit() {
        this.route.params.subscribe((p: { id: number }) => {
            if (p.id) {
                this.accion = 'Modificar';
                this.id = p.id;
                this.proxy.getColor(this.id).subscribe(e => {
                    this.color = e;
                    this.buildForm();
                });
            } else {
                this.accion = 'Nuevo';
                this.buildForm();
            }
        });
    }


    submit() {
        var nombre = this.form.get('nombre').value;
        if(nombre.trim().length > 0) {

            const plu = {
                id: this.id,
                color_id: this.id,
                nombre: this.form.get('nombre').value
            };

            if(plu.id > 0) {
                this.proxy.updateColor(plu).subscribe( data => {
                        this.toasterService.pop("success", "Exito", "Se actualizo el color satisfactoriamente");
                        this.router.navigate(['colores']);
                    }, error => {
                        this.toasterService.pop('error', 'Error', 'Error actualizando el Color');
                        this.err = error;
                    }
                );
            } else {
                this.proxy.createColor(plu).subscribe( data => {
                        this.toasterService.pop("success", "Exito", "Se creo el color satisfactoriamente");
                        this.router.navigate(['colores']);
                    }, error => {
                        this.toasterService.pop('error', 'Error', 'Error creando el Color');
                        this.err = error;
                    }
                );
            }
        } else {
            this.toasterService.pop("warning", "Advertencia", "El campo Color es obligatorio");
        }
    }



    cancel() {
        this.router.navigate(['colores']);
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
        };

        this.fb = new FormBuilder();
        const form = this.fb.group(group);

        form.controls['nombre'].setValue('');

        if (this.id !== -1) {
            form.controls['nombre'].setValue(this.color[0].nombre);

        }

        this.form = form;

    }

    onActivate(e) {
        console.log(e);
    }



}
