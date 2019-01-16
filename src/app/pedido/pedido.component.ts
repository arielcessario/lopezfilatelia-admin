import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';
import { CoreService } from 'ac-core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { Location } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'lfa-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit {

  private toasterService: ToasterService;

  form: FormGroup;
  private fb: FormBuilder;
  color: any;
  id = -1;
  err: string;
  showSave: boolean;
  confirmar_entrega: boolean;

  public detalles = [];

  public apellido = '';
  public nombre = '';
  public total = 0.0;
  public fecha = '';
  public status_name = '';
  public carrito_id = 0;
  public mail = '';
  // public confirmar_entrega = false;

  formErrors: any = {
    apellido: '',
    nombre: '',
    carrito_id: 0
  };

  validationMessages = {
    apellido: {
      required: 'Requerido',
      minlength: 'El nombre debe tener más de 10 letras o números'
    }
  };


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
      estampilla: {
        title: 'Estampilla',
        type: 'string'
      },
      nombre: {
        title: 'Variedad',
        type: 'string'
      },
      precio_unitario: {
        title: 'Pre. Unit.',
        type: 'string'
      },
      total: {
        title: 'Total',
        type: 'string'
      },
      en_oferta: {
        title: 'En Oferta',
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
    config: NgbModalConfig,
    private modalService: NgbModal,
    toasterService: ToasterService) {

    config.backdrop = 'static';
    config.keyboard = false;

    this.toasterService = toasterService;

  }

  ngOnInit() {
    this.getCarrito();
  }

  getCarrito() {
    this.route.params.subscribe((p: { id: number }) => {
      if (p.id) {
        this.id = p.id;
        this.proxy.getPedido(this.id).subscribe(data => {
          console.log(data);
          this.carrito_id = data.carrito_id;
          this.apellido = data.apellido;
          this.nombre = data.nombre;
          this.fecha = data.fecha;
          this.total = data.precio;
          this.status_name = data.status_name;
          this.mail = data.mail;
          this.detalles = data.detalles;
          this.showSave = data.status === 1 ? true : false;
          this.confirmar_entrega = data.status === 1 ? false : true;

          this.loadGrid();

          this.buildForm();
        });
      } else {
        this.buildForm();
      }
    });
  }

  loadGrid() {
    this.data = this.detalles;
    this.source.load(this.data);
  }


  submit() {
    // TODO: hacer el update del carrito con el id para cambiar el estado a 2.
    // Mandar la fecha para que no la modifique con la fecha actual.

    const carrito = {
      carrito_id: this.id,
      fecha: this.fecha,
      status: this.confirmar_entrega ? 2 : 1
    };

    this.proxy.updateCarritoStatus(carrito).subscribe(
            data => {
              this.router.navigate(['pedidos']);
        }, error => {
            this.err = error;
        }
    );

  }

  cancel() {
    this.router.navigate(['pedidos']);
  }

/*
  buildForm() {
    const group: any = {
      carrito_id: [this.carrito_id, [Validators.required]],
      apellido: [
        this.apellido,
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15)
        ]
      ],
      nombre: [this.nombre, [Validators.required]],
      fecha: [this.fecha, [Validators.required]],
      total: [this.total, [Validators.required]],
      status_name: [this.status_name, [Validators.required]],
      mail: [this.mail, [Validators.required]],
    };

    this.fb = new FormBuilder();
    const form = this.fb.group(group);

    form.controls['apellido'].setValue('');
    form.controls['nombre'].setValue('');
    form.controls['fecha'].setValue('');
    form.controls['total'].setValue('');
    form.controls['carrito_id'].setValue(0);
    form.controls['status_name'].setValue('');
    form.controls['mail'].setValue('');

    if (this.id !== -1) {
      form.controls['apellido'].setValue(this.apellido);
      form.controls['nombre'].setValue(this.nombre);
      form.controls['fecha'].setValue(this.fecha);
      form.controls['total'].setValue(this.total);
      form.controls['carrito_id'].setValue(this.carrito_id);
      form.controls['status_name'].setValue(this.status_name);
      form.controls['mail'].setValue(this.mail);

      let aux = this.detalles;
      let temp = new Array();

      aux.forEach(function(element) {
        temp.push({
          estampilla_id: element.estampilla_id,
          estampilla_variedad_id: element.estampilla_variedad_id,
          codigo_jalil: element.codigo_jalil,
          codigo_yt: element.codigo_yt,
          codigo_arg: element.codigo_arg,
          variedad: element.nombre,
          oferta: element.oferta,
          color_id: element.color_id,
          precio: element.precio,
          precio2: element.precio2,
          precio3: element.precio3,
          precio4: element.precio4,
          precio5: element.precio5
        });
      });

      this.detalles = temp;

    }

    this.form = form;

  }*/

  buildForm() {

      const aux = this.detalles;
      const temp = new Array();

      aux.forEach(function(element) {
        temp.push({
          estampilla_id: element.estampilla_id,
          estampilla_variedad_id: element.estampilla_variedad_id,
          codigo_jalil: element.codigo_jalil,
          codigo_yt: element.codigo_yt,
          codigo_arg: element.codigo_arg,
          variedad: element.nombre,
          oferta: element.oferta,
          color_id: element.color_id,
          precio: element.precio,
          precio2: element.precio2,
          precio3: element.precio3,
          precio4: element.precio4,
          precio5: element.precio5
        });
      });

      this.detalles = temp;

  }

  onActivate(e) {
    // console.log(e);
  }

  showHelp(content) {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }


  confirmarEntrega() {
    const carrito = {
      carrito_id: this.id,
      fecha: this.fecha,
      status: 2
    };

    this.proxy.confirmarEntrega(carrito).subscribe(
            data => {
                this.toasterService.pop('success', 'Exito', 'Se Confirmo la Entrega satisfactoriamente');
                this.router.navigate(['pedidos']);
        }, error => {
                this.err = error;
        }
    );
  }

}
