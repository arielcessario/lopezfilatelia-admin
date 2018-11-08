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
  datoBasico: any;
  id = -1;

  public razonSocial = '';
  public cuit = '';
  public fecha = '';
  public alias = '';
  public region = [];
  public zona = [];
  public direccion = '';
  public hectareas = '';
  public cantidadPotreros = 0;
  public phonePrefix = '';
  public phoneNumber = '';
  public mobile = '';
  public mail = '';

  formErrors: any = {
    razonSocial: '',
    cuit: '',
    fecha: '',
    alias: '',
    region: '',
    zona: '',
    direccion: '',
    hectareas: '',
    cantidadPotreros: '',
    phonePrefix: '',
    phoneNumber: '',
    mobile: '',
    mail: ''
  };

  validationMessages = {
    razonSocial: {
      required: 'Requerido',
      minlength: 'Mínimo 15 caracteres',
      maxlength: 'Máximo 15 caracteres'
    },
    cuit: {
      required: 'Requerido',
      maxlength: 'El CUIT debe tener 15 caracteres',
      minlength: 'El CUIT debe tener 15 caracteres'
    },
    fecha: {
      required: 'Requerido',
      maxlength: 'Maximo 50 caracteres'
    },
    alias: {
      required: 'Requerido',
      max: 'El hectareas debe tener al menos seis (6) letras y/o números'
    },
    region: {
      required: 'Requerido',
      max: 'El hectareas debe tener al menos seis (6) letras y/o números'
    },
    zona: {
      required: 'Requerido',
      max: 'El hectareas debe tener al menos seis (6) letras y/o números'
    },
    direccion: {
      required: 'Requerido',
      edireccion: 'Formato de direccion incorrecto'
    },
    hectareas: {
      required: 'Requerido',
      minlength: 'El hectareas debe tener al menos seis (6) letras y/o números',
      pattern:
        'El hectareas debe tener al menos una letra en mayúscula y un número'
    },
    cantidadPotreros: {
      required: 'Requerido',
      minlength: 'El hectareas debe tener al menos seis (6) letras y/o números'
    },
    phonePrefix: {
      required: 'Requerido',
      minlength: 'El hectareas debe tener al menos seis (6) letras y/o números'
    },
    phoneNumber: {
      required: 'Requerido',
      minlength: 'El hectareas debe tener al menos seis (6) letras y/o números'
    },
    mail: {
      required: 'Requerido',
      email: 'Formato de mail incorrecto'
    }
  };

  constructor(
    private coreService: CoreService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p: { id: number }) => {
      if (p.id) {
        this.id = p.id;
      } else {
        this.buildForm();
      }
    });
  }

  submit() {
    const plu = {
      id: this.id,
      razonSocial: this.form.get('razonSocial').value,
      cuit: this.form.get('cuit').value,
      fecha: this.form.get('fecha').value,
      alias: this.form.get('alias').value,
      region: this.form.get('region').value,
      zona: this.form.get('zona').value,
      direccion: this.form.get('direccion').value,
      hectareas: this.form.get('hectareas').value,
      cantidadPotreros: this.form.get('cantidadPotreros').value,
      phonePrefix: this.form.get('phonePrefix').value,
      phoneNumber: this.form.get('phoneNumber').value,
      mobile: this.form.get('mobile').value,
      mail: this.form.get('mail').value
    };
  }

  buildForm() {
    // Checkbox de cantidadPotreros

    const group: any = {
      razonSocial: [this.razonSocial, [Validators.required]],
      cuit: [
        this.cuit,
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15)
        ]
      ],
      fecha: [this.fecha, [Validators.required]],
      alias: [this.alias, [Validators.required]],
      region: [this.region, [Validators.required]],
      zona: [this.zona, [Validators.required]],
      direccion: [this.direccion, [Validators.required]],
      hectareas: [this.hectareas, [Validators.required]],
      cantidadPotreros: [this.cantidadPotreros, [Validators.required]],
      phonePrefix: [
        this.phonePrefix,
        [Validators.required, Validators.max(9999)]
      ],
      phoneNumber: [
        this.phoneNumber,
        [Validators.required, Validators.max(9999999)]
      ],
      mobile: [this.mobile],
      mail: [this.mail, [Validators.email]]
    };

    this.fb = new FormBuilder();
    const form = this.fb.group(group);

    form.controls['razonSocial'].setValue('');
    form.controls['cuit'].setValue('');
    form.controls['fecha'].setValue('');
    form.controls['alias'].setValue('');
    form.controls['region'].setValue(0);
    form.controls['zona'].setValue(0);
    form.controls['direccion'].setValue('');
    form.controls['hectareas'].setValue('');
    form.controls['cantidadPotreros'].setValue(0);
    form.controls['phonePrefix'].setValue('');
    form.controls['phoneNumber'].setValue('');
    form.controls['mobile'].setValue(true);
    form.controls['mail'].setValue('');

    if (this.id !== -1) {
      form.controls['razonSocial'].setValue(this.datoBasico['razonSocial']);
      form.controls['cuit'].setValue(this.datoBasico['cuit']);
      form.controls['fecha'].setValue(this.datoBasico['fecha']);
      form.controls['alias'].setValue(this.datoBasico['alias']);
      form.controls['region'].setValue(this.datoBasico['region']);
      form.controls['zona'].setValue(this.datoBasico['zona']);
      form.controls['direccion'].setValue(this.datoBasico['direccion']);
      form.controls['hectareas'].setValue(this.datoBasico['hectareas']);
      form.controls['cantidadPotreros'].setValue(
        this.datoBasico['cantidadPotreros']
      );
      form.controls['phonePrefix'].setValue(this.datoBasico['phonePrefix']);
      form.controls['phoneNumber'].setValue(this.datoBasico['phoneNumber']);
      form.controls['mobile'].setValue(this.datoBasico['mobile']);
      form.controls['mail'].setValue(this.datoBasico['mail']);
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
