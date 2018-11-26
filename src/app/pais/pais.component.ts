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
import {ToasterModule, ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';



@Component({
    selector: 'lfa-pais',
    templateUrl: './pais.component.html',
    styleUrls: ['./pais.component.scss'],
})
export class PaisComponent implements OnInit {

    private toasterService: ToasterService;

    position = 'toast-top-center';
    animationType = 'fade';
    title = 'HI there!';
    content = `I'm cool toaster!`;
    timeout = 5000;
    toastsLimit = 5;
    type = 'default';
    isNewestOnTop = true;
    isHideOnClick = true;
    isDuplicatesPrevented = false;
    isCloseButton = true;

    config: ToasterConfig = new ToasterConfig({
        positionClass: this.position,
        timeout: this.timeout,
        newestOnTop: this.isNewestOnTop,
        tapToDismiss: this.isHideOnClick,
        preventDuplicates: this.isDuplicatesPrevented,
        animation: this.animationType,
        limit: this.toastsLimit
    });

    types: string[] = ['default', 'info', 'success', 'warning', 'error'];
    animations: string[] = [
        'fade',
        'flyLeft',
        'flyRight',
        'slideDown',
        'slideUp'
    ];
    positions: string[] = [
        'toast-top-full-width',
        'toast-bottom-full-width',
        'toast-top-left',
        'toast-top-center',
        'toast-top-right',
        'toast-bottom-right',
        'toast-bottom-center',
        'toast-bottom-left',
        'toast-center'
    ];

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

        this.coreService.showToast.subscribe(toast => {
            console.log(toast);
            this.makeToast(toast);
        });
    }


    makeToast(toast) {
        console.log(toast);
        this.showToast(toast.type, toast.title, toast.body);
    }

    private showToast(type: string, title: string, body: string) {
        console.log(title);
        this.config = new ToasterConfig({
            positionClass: this.position,
            timeout: this.timeout,
            newestOnTop: this.isNewestOnTop,
            tapToDismiss: this.isHideOnClick,
            preventDuplicates: this.isDuplicatesPrevented,
            animation: this.animationType,
            limit: this.toastsLimit
        });
        const toast: Toast = {
            type: type,
            title: title,
            body: body,
            timeout: this.timeout,
            showCloseButton: this.isCloseButton,
            bodyOutputType: BodyOutputType.TrustedHtml
        };
        this.toasterService.popAsync(toast);
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

        var nombre = this.form.get('nombre').value;
        if(nombre.trim().length > 0) {

            const plu = {
                id: this.id,
                pais_id: this.id,
                nombre: this.form.get('nombre').value
            };

            if(plu.id > 0) {
                this.proxy.updatePais(plu).subscribe( data => {
                        this.toasterService.pop("success", "Exito", "Se actualizo el pais satisfactoriamente");
                        this.router.navigate(['paises']);
                    }, error => {
                        this.toasterService.pop('error', 'Error', 'Error actualizando el Pais');
                        this.err = error;
                    }
                );
            } else {
                this.proxy.createPais(plu).subscribe( data => {
                        this.toasterService.pop("success", "Exito", "Se creo el pais satisfactoriamente");
                        this.router.navigate(['paises']);
                    }, error => {
                        this.toasterService.pop('error', 'Error', 'Error creando el Pais');
                        this.err = error;
                    }
                );
            }
        } else {
            this.toasterService.pop("warning", "Advertencia", "El campo pais es obligatorio");
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
