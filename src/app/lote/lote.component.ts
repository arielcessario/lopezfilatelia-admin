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
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'lfa-lote',
    templateUrl: './lote.component.html',
    styleUrls: ['./lote.component.scss'],
    providers: [
        // { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }
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
    // public hora_inicio: any = {};
    // public hora_fin: any = {};
    public precio = '';
    public codigo_yt = '';
    public codigo_arg = '';
    public status = 1;
    public pausar = true;
    public imagen = 'no_image.png';
    public precio_1 = '';
    public boton = 'Pausar Subasta';
    public filterDiags = '';
    public filterDiagsYT = '';
    public filterDiagsArg = '';
    public filterDiagsJalil = '';
    public codigoTitulo = '';

    filtros: Array<any> = [];
    // filtrosYT: Array<any> = [];
    // filtrosArg: Array<any> = [];
    // filtrosJalil: Array<any> = [];
    filtrosEstamp: Array<any> = [];

    imagesPath = environment.imagesPath;


    formErrors: any = {
        lote_id: '',
        nombre: '',
    };

    validationMessages = {
        nombre: {
            required: 'Requerido',
            minlength: 'El nombre debe tener más de 10 letras o n�meros'
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
            codigo_yt: {
                title: 'Código YT',
                type: 'string'
            },
            codigo_arg: {
                title: 'Código Arg',
                type: 'string'
            },
            codigo_jalil: {
              title: 'Código Jalil',
              type: 'string'
          },
            nombre: {
                title: 'Estampilla',
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
        private modalService: NgbModal,
        toasterService: ToasterService) {

        this.toasterService = toasterService;

    }

    ngOnInit() {
        this.buscarEstampillas();

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

    buscarEstampillas() {
      this.proxy.buscarEstampillas().subscribe(data => {
          // console.log(data);
          // this.filtros = data.estampillas;
          // this.filtrosYT = data.codigos_yt;
          // this.filtrosArg = data.codigos_arg;
          // this.filtrosJalil = data.codigos_jalil;
          this.filtrosEstamp = data.estampillas;
      });
    }


    submit() {
        const precio1 = parseInt(this.form.get('precio_1').value.toString(), 0);

        const plu = {
            id: this.id,
            lote_id: this.id,
            nombre: this.form.get('nombre').value,
            precio: this.form.get('precio').value,
            precio_base_1: this.form.get('precio_1').value,
            precio_base_2: 0,
            precio_base_3: 0,
            fecha_inicio: this.fecha_inicio,
            fecha_fin: this.fecha_fin,
            // hora_inicio: this.hora_inicio,
            // hora_fin: this.hora_fin,
            estampillas: this.estampillas,
            path: this.imagen
        };

        const aux1 = new Date(this.fecha_inicio.year, this.fecha_inicio.month - 1, this.fecha_inicio.day);
        const aux2 = new Date(this.fecha_fin.year, this.fecha_fin.month - 1, this.fecha_fin.day);
        const today = new Date();

        if (aux1 >= today) {
            if (aux1 <= aux2) {
                if (plu.estampillas.length > 0) {
                    if (plu.id > 0) {
                        this.proxy.updateLote(plu).subscribe(
                                data => {
                                    if (this.status === 1) {
                                      this.sendMail(this.id);
                                    }
                                    this.toasterService.pop('success', 'Exito', 'Se actualizo el lote satisfactoriamente');
                                    this.router.navigate(['lotes']);
                            }, error => {
                                    this.err = error;
                            }
                        );
                    } else {
                        this.proxy.createLote(plu).subscribe(
                                data => {
                                    this.sendMail(data);
                                    this.toasterService.pop('success', 'Exito', 'Se creó el lote satisfactoriamente');
                                    this.router.navigate(['lotes']);
                            }, error => {
                                    this.err = error;
                            }
                        );
                    }
                } else {
                    this.toasterService.pop('warning', 'Advertencia', 'Debe agregar estampillas al lote');
                }
            } else {
                this.toasterService.pop('warning', 'Advertencia', 'La Fecha Fin debe ser mayor que la Fecha de Inicio');
            }
        } else {
            this.toasterService.pop('warning', 'Advertencia', 'La Fecha Inicio no puede ser menor que la Fecha Actual');
        }

    }


    sendMail(lote_id) {
        // Notifico via mail que hay un nuevo lote creado
        this.proxy.informarLote(lote_id).subscribe(
                data => {
                  console.log(data);
            }, error => {
                  this.err = error;
            }
        );
    }

    cancel() {
        this.router.navigate(['lotes']);
    }

    changeStatus() {
        if (this.status === 1) {
            this.status = 4;
        } else if (this.status === 4) {
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
            // fecha_inicio: [this.fecha_inicio, [Validators.required]],
            // fecha_fin: [this.fecha_fin, [Validators.required]],
            precio: [this.precio, [Validators.required]],
            precio_1: [this.precio_1, [Validators.required]],
        };

        this.fb = new FormBuilder();
        const form = this.fb.group(group);

        form.controls['nombre'].setValue('');
        form.controls['precio'].setValue('');
        form.controls['precio_1'].setValue('');
        this.fecha_inicio = {};
        this.fecha_fin = {};
        // this.hora_inicio = {};
        // this.hora_fin = {};
        this.status = 1;
        this.imagen = '';

        if (this.id !== -1) {
            form.controls['nombre'].setValue(this.lote[0].nombre);
            form.controls['precio'].setValue(this.lote[0].precio);
            form.controls['precio_1'].setValue(this.lote[0].precio_base_1);
            this.status = this.lote[0].status;
            this.pausar = (this.lote[0].status === 4) ? false : true;
            this.imagen = this.lote[0].path;
            this.boton = (this.lote[0].status === 4) ? 'Activar Subasta' : 'Pausar Subasta';

            const aux1 = new Date(this.lote[0].fecha_inicio);
            const aux2 = new Date(this.lote[0].fecha_fin);
            this.fecha_inicio = { year: aux1.getFullYear(), month: aux1.getMonth() + 1, day: aux1.getDate() };
            // this.hora_inicio = { hour: aux1.getHours(), minute: aux1.getMinutes(), second: 0 };
            this.fecha_fin = { year: aux2.getFullYear(), month: aux2.getMonth() + 1, day: aux2.getDate() };
            // this.hora_fin = { hour: aux2.getHours(), minute: aux2.getMinutes(), second: 0 };

            const aux = this.lote['estampillas'];
            const temp = new Array();

            aux.forEach(function(element) {
                temp.push({
                    estampilla_id: element.estampilla_id,
                    codigo_yt: element.codigo_yt,
                    codigo_arg: element.codigo_arg,
                    codigo_jalil: element.codigo_jalil,
                    nombre: element.nombre,
                    estampilla_variedad_id: element.estampilla_variedad_id
                });
            });

            this.estampillas = temp;
            // console.log(this.estampillas);
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
            for (let i = 0; i < this.estampillas.length; i++) {
                if (event.data.estampilla_variedad_id === this.estampillas[i].estampilla_variedad_id) {
                    this.estampillas.splice(i, 1);
                    this.loadGrid();
                }
            }

            for (let i = 0; i <= this.filtros.length - 1; i++) {
              const estampilla_variedad_id = this.filtros[i].estampilla_variedad_id;
              if (estampilla_variedad_id === event.data.estampilla_variedad_id) {
                  this.filtros[i].selected = 0;
              }
            }
        } else {
            // event.confirm.reject();
        }
    }

    onActivate(e) {
        console.log(e);
    }

/*
    searchYT() {
        this.proxy.buscarEstampillas().subscribe(data => {
            if (data) {
                console.log(data);
                let encontrado = false;
                for (let i = 0; i < data.length; i++) {
                    if (this.codigo_yt === data[i].codigo_yt) {
                      const aux = {
                            estampilla_id: data[i].estampilla_id,
                            codigo_yt: data[i].codigo_yt,
                            codigo_arg: data[i].codigo_arg,
                            nombre: data[i].nombre,
                            estampilla_variedad_id: data[i].estampilla_variedad_id
                        };
                        this.estampillas.push(aux);
                        this.codigo_yt = '';
                        encontrado = true;
                        this.loadGrid();
                    }
                }
                if (!encontrado) {
                    this.toasterService.pop('warning', 'Advertencia', 'No existe el codigo ingresado');
                }
            }
        });
    }
*/


    quitarEstampilla(item) {
        for (let i = 0; i <= this.estampillas.length - 1; i++) {
            if (item.estampilla_variedad_id === this.estampillas[i].estampilla_variedad_id) {
                // this.estampillas[i].selected = 0;
                this.estampillas.splice(i, 1);
                this.loadGrid();
            }
        }

        for (let i = 0; i <= this.filtros.length - 1; i++) {
          const estampilla_id = this.filtros[i].estampilla_id;
          const estampilla_variedad_id = this.filtros[i].estampilla_variedad_id;
          if (estampilla_id === item.estampilla_id && estampilla_variedad_id === item.estampilla_variedad_id) {
              this.filtros[i].selected = 0;
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

    pausarLote() {
      const lote = {
        lote_id: this.id,
        status: (this.status === 4) ? 1 : 4
      };

      const mensaje = (this.status === 4) ? 'Se Activo la Subasta satisfactoriamente' : 'Se Pauso la Subasta satisfactoriamente';

      this.proxy.pausarLote(lote).subscribe(
              data => {
                  this.toasterService.pop('success', 'Exito', mensaje);
                  this.router.navigate(['lotes']);
          }, error => {
                  this.err = error;
          }
      );
    }


    addEstampillaYT(content) {
      if (this.filterDiagsYT.trim() === '') {
        this.toasterService.pop('warning', 'Advertencia', 'Ingrese un Código YT para realizar la busqueda.');
        return;
      }

      const temp = [];
      for (let i = 0; i <= this.filtrosEstamp.length - 1; i++) {
        const codigo = this.filtrosEstamp[i].codigo_yt.toLowerCase();
        if (codigo.includes(this.filterDiagsYT.toLowerCase())) {
            this.filtrosEstamp[i].selected = this.filtrosEstamp[i].selected;
            temp.push(this.filtrosEstamp[i]);
        }
      }

      if (temp.length === 0) {
        this.toasterService.pop('warning', 'Advertencia', 'El Código YT ingresado no existe. Por favor ingrese otro código.');
      } else if (temp.length === 1) {
        this.addItem(temp[0]);
      } else {
        this.codigoTitulo = 'Código YT: ' + this.filterDiagsYT.toLowerCase();
        this.filtros = temp;
        this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
      }
    }

    addEstampillaArg(content) {
      if (this.filterDiagsArg.trim() === '') {
        this.toasterService.pop('warning', 'Advertencia', 'Ingrese un Código Arg para realizar la busqueda.');
        return;
      }

      const temp = [];
      for (let i = 0; i <= this.filtrosEstamp.length - 1; i++) {
        const codigo = this.filtrosEstamp[i].codigo_arg.toLowerCase();
        if (codigo.includes(this.filterDiagsArg.toLowerCase())) {
          this.filtrosEstamp[i].selected = this.filtrosEstamp[i].selected;
            temp.push(this.filtrosEstamp[i]);
        }
      }

      if (temp.length === 0) {
        this.toasterService.pop('warning', 'Advertencia', 'El Código Arg ingresado no existe. Por favor ingrese otro código.');
      } else if (temp.length === 1) {
        this.addItem(temp[0]);
      } else {
        this.codigoTitulo = 'Código Arg: ' + this.filterDiagsArg.toLowerCase();
        this.filtros = temp;
        this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
      }
    }

    addEstampillaJalil(content) {
      if (this.filterDiagsJalil.trim() === '') {
        this.toasterService.pop('warning', 'Advertencia', 'Ingrese un Código Jalil para realizar la busqueda.');
        return;
      }

      const temp = [];
      for (let i = 0; i <= this.filtrosEstamp.length - 1; i++) {
        const codigo = this.filtrosEstamp[i].codigo_jalil.toLowerCase();
        if (codigo.includes(this.filterDiagsJalil.toLowerCase())) {
          this.filtrosEstamp[i].selected = this.filtrosEstamp[i].selected;
            temp.push(this.filtrosEstamp[i]);
        }
      }

      if (temp.length === 0) {
        this.toasterService.pop('warning', 'Advertencia', 'El Código Jalil ingresado no existe. Por favor ingrese otro código.');
      } else if (temp.length === 1) {
        this.addItem(temp[0]);
      } else {
        this.codigoTitulo = 'Código Jalil: ' + this.filterDiagsJalil.toLowerCase();
        this.filtros = temp;
        this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
      }
    }

    addItem(item) {
      for (let i = 0; i <= this.filtros.length - 1; i++) {
        const estampilla_id = this.filtros[i].estampilla_id;
        const estampilla_variedad_id = this.filtros[i].estampilla_variedad_id;
        if (estampilla_id === item.estampilla_id && estampilla_variedad_id === item.estampilla_variedad_id) {
            this.filtros[i].selected = 1;
        }
      }

      const aux = {
        estampilla_id: item.estampilla_id,
        codigo_yt: item.codigo_yt,
        codigo_arg: item.codigo_arg,
        codigo_jalil: item.codigo_jalil,
        nombre: item.estampilla,
        estampilla_variedad_id: item.estampilla_variedad_id,
        selected: 1
      };

      this.estampillas.push(aux);
      this.loadGrid();
      this.toasterService.pop('success', 'Exito', 'Se agrego la Estampilla al Lote satisfactoriamente.');
    }

}
