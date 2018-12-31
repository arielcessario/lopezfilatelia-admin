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
    //public hora_inicio: any = {};
    //public hora_fin: any = {};
    public precio = '';
    public codigo_yt = "";
    public codigo_arg = "";
    public status = 1;
    public pausar = 0;
    public imagen = 'no_image.png';
    public precio_1 = '';
    public precio_2 = '';
    public precio_3 = '';

    imagesPath = environment.imagesPath;


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


    settings = {
        mode: 'external',
        actions: {
            add: false,
            edit: false,
            delete: true
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
            codigo_yt: {
                title: 'codigo_yt',
                type: 'string'
            },
            codigo_arg: {
                title: 'codigo_arg',
                type: 'string'
            },
            nombre: {
                title: 'nombre',
                type: 'string'
            }
        }
    };

    allRows: Array<any> = [];
    source: LocalDataSource = new LocalDataSource();
    data = [];


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
                    console.log(e);
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
        if (this.form.get('precio_1').value > 0) {
            if (this.form.get('precio_1').value <= this.form.get('precio').value) {
                this.toasterService.pop("warning", "Advertencia", "La oferta base 1 no puede ser menor o igual que la oferta base");
                return
            }
        }
        if (this.form.get('precio_2').value > 0) {
            if (this.form.get('precio_2').value <= this.form.get('precio_1').value) {
                this.toasterService.pop("warning", "Advertencia", "La oferta base 2 no puede ser menor o igual que la oferta base 1");
                return
            }
        }
        if (this.form.get('precio_3').value > 0) {
            if (this.form.get('precio_3').value <= this.form.get('precio_2').value) {
                this.toasterService.pop("warning", "Advertencia", "La oferta base 3 no puede ser menor o igual que la oferta base 2");
                return
            }
        }


        const plu = {
            id: this.id,
            lote_id: this.id,
            nombre: this.form.get('nombre').value,
            precio: this.form.get('precio').value,
            precio_base_1: this.form.get('precio_1').value,
            precio_base_2: this.form.get('precio_2').value,
            precio_base_3: this.form.get('precio_3').value,
            fecha_inicio: this.fecha_inicio,
            fecha_fin: this.fecha_fin,
            //hora_inicio: this.hora_inicio,
            //hora_fin: this.hora_fin,
            estampillas: this.estampillas,
            status: (this.pausar == 1) ? 4 : 1,
            path: this.imagen
        };

        let aux1 = new Date(this.fecha_inicio.year, this.fecha_inicio.month - 1, this.fecha_inicio.day);
        let aux2 = new Date(this.fecha_fin.year, this.fecha_fin.month - 1, this.fecha_fin.day);
        let today = new Date();

        if(aux1 >= today) {
            if(aux1 <= aux2) {
                if(plu.estampillas.length > 0) {
                    if(plu.id > 0) {
                        this.proxy.updateLote(plu).subscribe(
                                data => {
                                    this.sendLote(this.id);
                                    this.toasterService.pop("success", "Exito", "Se actualizo el lote satisfactoriamente");
                                    this.router.navigate(['lotes']);
                            }, error => {
                                    this.err = error;
                            }
                        );
                    } else {
                        this.proxy.createLote(plu).subscribe(
                                data => {
                                    console.log(data);
                                    this.sendLote(data);
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
            } else {
                this.toasterService.pop("warning", "Advertencia", "La Fecha Fin debe ser mayor que la Fecha de Inicio");
            }
        } else {
            this.toasterService.pop("warning", "Advertencia", "La Fecha Inicio no puede ser menor que la Fecha Actual");
        }

    }


    sendLote(lote_id) {
        // Notifico via mail que hay un nuevo lote creado
        this.proxy.informarLote(lote_id).subscribe(
                data => {
                    // this.toasterService.pop("success", "Exito", "Se creó el lote satisfactoriamente");
                    // this.router.navigate(['lotes']);
            }, error => {
                    this.err = error;
            }
        );
    }

    cancel() {
        this.router.navigate(['lotes']);
    }

    changeStatus() {
        if(this.status == 1) {
            this.status = 4;
        } else if(this.status == 4) {
            this.status = 1;
        }

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
            precio_1: [this.precio_1, [Validators.required]],
            precio_2: [this.precio_2, [Validators.required]],
            precio_3: [this.precio_3, [Validators.required]],
        };

        this.fb = new FormBuilder();
        const form = this.fb.group(group);

        form.controls['nombre'].setValue('');
        form.controls['precio'].setValue('');
        form.controls['precio_1'].setValue('');
        form.controls['precio_2'].setValue('');
        form.controls['precio_3'].setValue('');
        this.fecha_inicio = {};
        this.fecha_fin = {};
        //this.hora_inicio = {};
        //this.hora_fin = {};
        this.status = 1;
        this.imagen = '';

        if (this.id !== -1) {
            form.controls['nombre'].setValue(this.lote[0].nombre);
            form.controls['precio'].setValue(this.lote[0].precio);
            form.controls['precio_1'].setValue(this.lote[0].precio_base_1);
            form.controls['precio_2'].setValue(this.lote[0].precio_base_2);
            form.controls['precio_3'].setValue(this.lote[0].precio_base_3);
            this.status = this.lote[0].status;
            this.pausar = (this.lote[0].status == 4) ? 1 : 0;
            this.imagen = this.lote[0].path;

            let aux1 = new Date(this.lote[0].fecha_inicio);
            let aux2 = new Date(this.lote[0].fecha_fin);
            this.fecha_inicio = { year: aux1.getFullYear(), month: aux1.getMonth() + 1, day: aux1.getDate() };
            //this.hora_inicio = { hour: aux1.getHours(), minute: aux1.getMinutes(), second: 0 };
            this.fecha_fin = { year: aux2.getFullYear(), month: aux2.getMonth() + 1, day: aux2.getDate() };
            //this.hora_fin = { hour: aux2.getHours(), minute: aux2.getMinutes(), second: 0 };

            let aux = this.lote["estampillas"];
            let temp = new Array();

            aux.forEach(function(element) {
                temp.push({
                    estampilla_id: element.estampilla_id,
                    codigo_yt: element.codigo_yt,
                    codigo_arg: element.codigo_arg,
                    nombre: element.nombre,
                    estampilla_variedad_id: element.estampilla_variedad_id
                });
            });

            this.estampillas = temp;
            console.log(this.estampillas);

            this.loadGrid();

        }

        this.form = form;
    }

    loadGrid() {
        this.data = this.estampillas;
        this.source.load(this.data);
    }

    onDeleteConfirm(event): void {
        if (window.confirm('¿Esta seguro que desea eliminar el registro seleccionado?')) {
            console.log(event);
            for (var i = 0; i < this.estampillas.length; i++) {
                if (event.data.estampilla_variedad_id == this.estampillas[i].estampilla_variedad_id) {
                    this.estampillas.splice(i, 1);
                    this.loadGrid();
                }
            }
        } else {
            // event.confirm.reject();
        }
    }

    onActivate(e) {
        console.log(e);
    }


    searchYT() {
        this.proxy.buscarEstampillas().subscribe(data => {
            if (data) {
                console.log(data);
                let encontrado = false;
                for (var i = 0; i < data.length; i++) {
                    if (this.codigo_yt == data[i].codigo_yt) {
                        let aux = {
                            estampilla_id: data[i].estampilla_id,
                            codigo_yt: data[i].codigo_yt,
                            codigo_arg: data[i].codigo_arg,
                            nombre: data[i].nombre,
                            estampilla_variedad_id: data[i].estampilla_variedad_id
                        };
                        this.estampillas.push(aux);
                        this.codigo_yt = "";
                        encontrado = true;
                        this.loadGrid();
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
                        let aux = {
                            estampilla_id: data[i].estampilla_id,
                            codigo_yt: data[i].codigo_yt,
                            codigo_arg: data[i].codigo_arg,
                            nombre: data[i].nombre,
                            estampilla_variedad_id: data[i].estampilla_variedad_id
                        };
                        this.estampillas.push(aux);
                        this.codigo_arg = "";
                        encontrado = true;
                        this.loadGrid();
                    }
                }
                if(!encontrado) {
                    this.toasterService.pop("warning", "Advertencia", "No existe el codigo ingresado");
                }
            }
        });
    }

    quitarEstampilla(item) {
        console.log(item);
        for (var i = 0; i < this.estampillas.length; i++) {
            if (item.estampilla_variedad_id == this.estampillas[i].estampilla_variedad_id) {
                this.estampillas.splice(i, 1);
                this.loadGrid();
            }
        }
    }

    loadedImage(e) {
        this.imagen = e.originalName;
    }

    setImageName(_obj, val) {
        setTimeout(() => {
            this[_obj] = val;
        }, 0);
    }

}
