import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';
import { CoreService } from 'ac-core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'lfa-estampilla',
  templateUrl: './estampilla.component.html',
  styleUrls: ['./estampilla.component.scss']
})
export class EstampillaComponent implements OnInit {
  form: FormGroup;
  private fb: FormBuilder;
  estampilla: any;
  id = -1;
  accion = 'Crear';

  public estampilla_id = 0;
  public nombre = '';
  public titulo = '';
  public pais_id = 0;
  public estado_id = 0;
  public precio = 0.0;
  public precio2 = 0.0;
  public precio3 = 0.0;
  public catalogo_codigo = 0;
  public catalogo_id = 0;
  public estampilla_variedad_id = 0;
  public variedad = '';
  public descripcion = '';

  formErrors: any = {
    estampilla_id: '',
    nombre: '',
    titulo: '',
    pais_id: '',
    estado_id: '',
    precio: '',
    precio2: '',
    precio3: '',
    catalogo_codigo: '',
    catalogo_id: '',
    descripcion: ''
  };

  validationMessages = {
    nombre: {
      required: 'Requerido',
      minlength: 'El nombre debe tener más de 10 letras o números'
    }
  };

  constructor(
    private coreService: CoreService,
    private route: ActivatedRoute,
    private location: Location,
    private proxy: LopezfilateliaAdminProxy
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p: { id: number }) => {
      if (p.id) {
        this.accion = 'Modificar';
        this.id = p.id;
        this.proxy.getEstampilla(this.id).subscribe(e => {
          this.estampilla = e;
          this.buildForm();
        });
      } else {
        this.accion = 'Nueva';
        this.buildForm();
      }
    });
  }

  submit() {
    const plu = {
      id: this.id,
      estampilla_id: this.form.get('estampilla_id').value,
      nombre: this.form.get('nombre').value,
      titulo: this.form.get('titulo').value,
      pais_id: this.form.get('pais_id').value,
      estado_id: this.form.get('estado_id').value,
      precio: this.form.get('precio').value,
      precio2: this.form.get('precio2').value,
      precio3: this.form.get('precio3').value,
      catalogo_codigo: this.form.get('catalogo_codigo').value,
      catalogo_id: this.form.get('catalogo_id').value,
      descripcion: this.form.get('descripcion').value
    };
  }

  buildForm() {
    // Checkbox de cantidadPotreros

    const group: any = {
      estampilla_id: [this.estampilla_id, [Validators.required]],
      nombre: [
        this.nombre,
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15)
        ]
      ],
      titulo: [this.titulo, [Validators.required]],
      pais_id: [this.pais_id, [Validators.required]],
      estado_id: [this.estado_id, [Validators.required]],
      precio: [this.precio, [Validators.required]],
      precio2: [this.precio2, [Validators.required]],
      precio3: [this.precio3, [Validators.required]],
      catalogo_codigo: [this.catalogo_codigo, [Validators.required]],
      catalogo_id: [this.catalogo_id, [Validators.required]],
      descripcion: [this.descripcion, [Validators.required]]
    };

    this.fb = new FormBuilder();
    const form = this.fb.group(group);

    form.controls['estampilla_id'].setValue(0);
    form.controls['nombre'].setValue('');
    form.controls['titulo'].setValue('');
    form.controls['pais_id'].setValue(0);
    form.controls['estado_id'].setValue(0);
    form.controls['precio'].setValue(0.0);
    form.controls['precio2'].setValue(0.0);
    form.controls['precio3'].setValue(0.0);
    form.controls['catalogo_codigo'].setValue(0);
    form.controls['catalogo_id'].setValue(0);
    form.controls['descripcion'].setValue('');

    if (this.id !== -1) {
      form.controls['estampilla_id'].setValue(this.estampilla['estampilla_id']);
      form.controls['nombre'].setValue(this.estampilla['nombre']);
      form.controls['titulo'].setValue(this.estampilla['titulo']);
      form.controls['pais_id'].setValue(this.estampilla['pais_id']);
      form.controls['estado_id'].setValue(this.estampilla['estado_id']);
      form.controls['precio'].setValue(this.estampilla['precio']);
      form.controls['precio2'].setValue(this.estampilla['precio2']);
      form.controls['precio3'].setValue(this.estampilla['precio3']);
      form.controls['catalogo_codigo'].setValue(
        this.estampilla['catalogo_codigo']
      );
      form.controls['catalogo_id'].setValue(this.estampilla['catalogo_id']);
      form.controls['descripcion'].setValue(this.estampilla['descripcion']);
    }

    this.form = form;
    this.form.valueChanges.subscribe(data => {
      this.formErrors = this.coreService.onValueChanged(
        data,
        form,
        this.formErrors,
        this.validationMessages
      );
    });

    this.coreService.onValueChanged();
  }

  onActivate(e) {
    console.log(e);
  }

  minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        // get a list of checkbox values (boolean)
        .map(control => control.value)
        // total up the number of checked checkboxes
        .reduce((prev, next) => (next ? prev + next : prev), 0);

      // if the total is not greater than the minimum, return the error message
      return totalSelected >= min ? null : { required: true };
    };

    return validator;
  }
}
