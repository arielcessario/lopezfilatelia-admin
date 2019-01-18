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
    selector: 'lfa-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss'],
    providers: [
        // { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }
    ]
})
export class UsuarioComponent implements OnInit {

    private toasterService: ToasterService;

    form: FormGroup;
    private fb: FormBuilder;
    usuario: any;
    id = -1;
    accion = 'Crear';
    err: string;

    estampillas: Array<any> = [];

    public apellido = '';
    public nombre = '';
    public documento = '';
    public telefono = '';
    public fecha_nacimiento = '';
    public mail = '';
    public password = '';
    public password2 = '';
    public rol_id = 0;
    public forgotPassword = false;

    // public direccion = '';
    // public nro = '';
    // public piso = '';
    // public puerta = '';
    // public pais_id = 0;


    paises = [];
    roles = [];

    formErrors: any = {
        usuario_id: '',
        apellido: '',
        nombre: '',
    };

    validationMessages = {
        apellido: {
            required: 'Requerido',
            minlength: 'El nombre debe tener más de 10 letras o números'
        },
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
        this.getPaises();
        this.getRoles();

        this.route.params.subscribe((p: { id: number }) => {
            if (p.id) {
                this.forgotPassword = true;
                this.accion = 'Modificar';
                this.id = p.id;
                this.proxy.getUsuario(this.id).subscribe(e => {
                    this.usuario = e;
                    this.buildForm();
                });
            } else {
                this.forgotPassword = false;
                this.accion = 'Nuevo';
                this.buildForm();
            }
        });
    }

    getPaises() {
      this.proxy.getPaises().subscribe(data => {
          this.paises = data;
      });
    }

    getRoles() {
      const rol1 = {
        rol_id: 7,
        nombre: 'ADMINISTRADOR'
      };
      const rol2 = {
        rol_id: 1,
        nombre: 'CLIENTE'
      };
      const rol3 = {
        rol_id: 0,
        nombre: 'BLOQUEADO'
      };

      this.roles.push(rol1);
      this.roles.push(rol2);
      this.roles.push(rol3);
    }


    submit() {

        if (this.form.get('apellido').value.length === 0) {
            this.toasterService.pop('error', 'Error', 'El apellido es obligatorio');
            return;
        }
        if (this.form.get('nombre').value.length === 0) {
            this.toasterService.pop('error', 'Error', 'El nombre es obligatorio');
            return;
        }
        if (this.form.get('mail').value.length === 0) {
            this.toasterService.pop('error', 'Error', 'El mail es obligatorio');
            return;
        }
        if (this.password.trim().length > 0) {
            if (this.password.trim() !== this.password2.trim()) {
              this.toasterService.pop('error', 'Error', 'Las contraseñas deben ser iguales');
              return;
            }
        }

        const plu = {
            id: this.id,
            usuario_id: this.id,
            nombre: this.form.get('nombre').value,
            apellido: this.form.get('apellido').value,
            mail: this.form.get('mail').value,
            password: this.password,
            nro_doc: this.form.get('documento').value,
            marcado: 0,
            telefono: this.form.get('telefono').value,
            fecha_nacimiento: this.form.get('fecha_nacimiento').value,
            rol_id: this.rol_id,
            news_letter: 0,
            social_login: 0,
            // calle: this.form.get('direccion').value,
            // nro: this.form.get('nro').value,
            // piso: this.form.get('piso').value,
            // puerta: this.form.get('puerta').value,
            // ciudad_id: this.pais_id,
            // provincia_id: 0,
        };

        if (plu.id > 0) {
            this.proxy.updateUsuario(plu).subscribe(
                    data => {
                        this.toasterService.pop('success', 'Exito', 'Se actualizo el usuario satisfactoriamente');
                        this.router.navigate(['usuarios']);
                }, error => {
                        this.err = error;
                }
            );
        } else {
          this.proxy.createUsuario(plu).subscribe(
                  data => {
                      this.toasterService.pop('success', 'Exito', 'Se creó el usuario satisfactoriamente');
                      this.router.navigate(['usuarios']);
              }, error => {
                      this.err = error;
              }
          );

        }

    }

    cancel() {
        this.router.navigate(['usuarios']);
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
            apellido: [this.apellido, [Validators.required]],
            documento: [this.documento, [Validators.required]],
            telefono: [this.telefono, [Validators.required]],
            fecha_nacimiento: [this.fecha_nacimiento, [Validators.required]],
            mail: [this.mail, [Validators.required]],
            password: [this.password, [Validators.required]],
            // direccion: [this.direccion, [Validators.required]],
            // nro: [this.nro, [Validators.required]],
            // piso: [this.piso, [Validators.required]],
            // puerta: [this.puerta, [Validators.required]],
        };

        this.fb = new FormBuilder();
        const form = this.fb.group(group);

        form.controls['nombre'].setValue('');
        form.controls['apellido'].setValue('');
        form.controls['documento'].setValue('');
        form.controls['telefono'].setValue('');
        form.controls['fecha_nacimiento'].setValue('');
        form.controls['mail'].setValue('');
        this.password = '';
        this.rol_id = 7;
        // form.controls['direccion'].setValue('');
        // form.controls['nro'].setValue('');
        // form.controls['piso'].setValue('');
        // form.controls['puerta'].setValue('');
        // form.controls['password'].setValue('');
        // this.pais_id = 1;

        if (this.id !== -1) {
            form.controls['nombre'].setValue(this.usuario[0].nombre);
            form.controls['apellido'].setValue(this.usuario[0].apellido);
            form.controls['documento'].setValue(this.usuario[0].documento);
            form.controls['telefono'].setValue(this.usuario[0].telefono);
            form.controls['fecha_nacimiento'].setValue(this.usuario[0].fecha_nacimiento);
            form.controls['mail'].setValue(this.usuario[0].mail);
            this.rol_id = this.usuario[0].rol_id;
            form.controls['password'].setValue(this.usuario[0].password);

            // form.controls['direccion'].setValue(this.usuario[0].direccion);
            // form.controls['nro'].setValue(this.usuario[0].nro);
            // form.controls['piso'].setValue(this.usuario[0].piso);
            // form.controls['puerta'].setValue(this.usuario[0].puerta);
            // this.pais_id = this.usuario[0].ciudad_id;

        }

        this.form = form;
    }


    onActivate(e) {
        console.log(e);
    }


    resetPassword() {
      if (this.form.get('mail').value.trim().length === 0) {
          this.err = 'El mail es obligatorio';
          setTimeout(() => (this.err = undefined), 4000);
          return;
      }

      const usuario = {
        nombre: 'Mateo Maneff',
        mail: this.form.get('mail').value.trim(),
        admin: false
      };

      this.proxy.filateliaResetPassword(usuario).subscribe(
              data => {
                   console.log(data);
              },
              error => {
                  console.log(error);
                  this.err = error;
                  setTimeout(() => (this.err = undefined), 4000);
          }
      );
    }

}
