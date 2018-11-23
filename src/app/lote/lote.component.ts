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

@Component({
    selector: 'lfa-lote',
    templateUrl: './lote.component.html',
    styleUrls: ['./lote.component.scss']
})
export class LoteComponent implements OnInit {

    form: FormGroup;
    private fb: FormBuilder;
    lote: any;
    id = -1;
    accion = 'Crear';
    err: string;

    public nombre = '';


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
    }

    submit() {
        const plu = {
            id: this.id,
            lote_id: this.id,
            nombre: this.form.get('nombre').value,
        };

        console.log('guardar', plu);

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
        };

        this.fb = new FormBuilder();
        const form = this.fb.group(group);

        form.controls['nombre'].setValue('');

        if (this.id !== -1) {
            form.controls['nombre'].setValue(this.lote[0].nombre);
        }

        this.form = form;
    }

    onActivate(e) {
        console.log(e);
    }


}
