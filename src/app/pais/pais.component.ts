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
    selector: 'lfa-pais',
    templateUrl: './pais.component.html',
    styleUrls: ['./pais.component.scss'],
})
export class PaisComponent implements OnInit {

    private toasterService: ToasterService;


    form: FormGroup;
    private fb: FormBuilder;
    pais: any;
    id = -1;
    accion = 'Crear';
    err: string;

    public nombre = '';

    formErrors: any = {
        pais_id: '',
        nombre: '',
    };

    validationMessages = {
        nombre: {
            required: 'Requerido',
            minlength: 'El nombre debe tener m�s de 10 letras o n�meros'
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
                this.proxy.getPaise(this.id).subscribe(e => {
                    this.pais = e;
                    this.buildForm();
                });
            } else {
                this.accion = 'Nuevo';
                this.buildForm();
            }
        });
    }

    submit() {

        const nombre = this.form.get('nombre').value;
        if (nombre.trim().length > 0) {

            const plu = {
                id: this.id,
                pais_id: this.id,
                nombre: this.form.get('nombre').value
            };

            if (plu.id > 0) {
                this.proxy.updatePais(plu).subscribe( data => {
                        this.toasterService.pop('success', 'Exito', 'Se actualizo el pais satisfactoriamente');
                        this.router.navigate(['paises']);
                    }, error => {
                        this.toasterService.pop('error', 'Error', 'Error actualizando el Pais');
                        this.err = error;
                    }
                );
            } else {
                this.proxy.createPais(plu).subscribe( data => {
                        this.toasterService.pop('success', 'Exito', 'Se creo el pais satisfactoriamente');
                        this.router.navigate(['paises']);
                    }, error => {
                        this.toasterService.pop('error', 'Error', 'Error creando el Pais');
                        this.err = error;
                    }
                );
            }
        } else {
            this.toasterService.pop('warning', 'Advertencia', 'El campo pais es obligatorio');
        }
    }



    cancel() {
        this.router.navigate(['paises']);
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
            form.controls['nombre'].setValue(this.pais[0].nombre);

        }

        this.form = form;

    }

    onActivate(e) {
        console.log(e);
    }



}
