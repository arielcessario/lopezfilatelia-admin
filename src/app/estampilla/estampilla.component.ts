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
  err: string;
  paises: Array<any> = [];

  // Nombres de las Imagenes
  _img01Name = 'no_image.png';
  _img02Name = 'no_image.png';
  _img03Name = 'no_image.png';
  _img04Name = 'no_image.png';
  _img05Name = 'no_image.png';

  images = [];

  imagesPath = environment.imagesPath;

  public variedades = [];

  public descripcion = '';
  public status = 1;
  public estampilla_id = 0;
  public nombre = '';
  public pais_id = 1;
  public estado_id = 0;
  public catalogo_id = 0;
  public estampilla_variedad_id = 0;
  public anio = 0;


  formErrors: any = {
    estampilla_id: '',
    nombre: '',
    anio: 0,
    estado_id: '',
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
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private proxy: LopezfilateliaAdminProxy
  ) {}

  ngOnInit() {
    //Cargo listado de paises
    this.cargarPaises();

    //Determino si es update o insert
    this.saveOrUpdate();
  }

  cargarPaises() {
    this.proxy.getPaises().subscribe(e => {
      this.paises = e;
    });
  }

  saveOrUpdate() {
    this.route.params.subscribe((p: { id: number }) => {
      if (p.id) {
        this.accion = 'Modificar';
        this.id = p.id;
        this.proxy.getEstampilla(this.id).subscribe(e => {
          this.estampilla = e;

          this.buildForm();
          this.proxy.getEstampillaImagenes(this.id).subscribe(imagenes => {
            this.images = [];
            for (let i = 0; i < imagenes.length; i++) {
              this.images.push(imagenes[i].path);
            }
          });
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
      //estampilla_id: this.form.get('estampilla_id').value,
      estampilla_id: this.id,
      nombre: this.form.get('nombre').value,
      pais_id: this.pais_id,
      anio: this.form.get('anio').value,
      estado_id: this.form.get('estado_id').value,
      catalogo_id: this.form.get('catalogo_id').value,
      descripcion: this.form.get('descripcion').value,
      status: this.status,
      variedades: this.variedades,
      imagenes: this.images
    };

    console.log('guardar', plu);

    if(plu.id > 0) {
      this.proxy.updateEstampilla(plu).subscribe( data => {
            console.log(data);
            this.router.navigate(['estampillas']);
          }, error => {
            this.err = error;
          }
      );
    } else {
      this.proxy.createEstampilla(plu).subscribe( data => {
            console.log(data);
            this.router.navigate(['estampillas']);
          }, error => {
            this.err = error;
          }
      );
    }

  }

  cancel() {
    this.router.navigate(['estampillas']);
  }



  addVariedad() {
    this.variedades.push({
      codigo_yt: "",
      codigo_arg: "",
      variedad: "",
      precio: "",
      precio2: "",
      precio3: "",
      precio4: "",
      precio5: ""
    });
  }

  removeVariedad(item) {
    for (var i = 0; i < this.variedades.length; i++) {
      if (item.codigo_yt == this.variedades[i].codigo_yt && item.codigo_arg == this.variedades[i].codigo_arg
          && item.variedad == this.variedades[i].variedad && item.precio == this.variedades[i].precio
          && item.precio2 == this.variedades[i].precio2 && item.precio3 == this.variedades[i].precio3) {
        this.variedades.splice(i, 1);
      }
    }
  }

  buildForm() {
    const group: any = {
      //estampilla_id: [this.estampilla_id, [Validators.required]],
      nombre: [
        this.nombre,
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15)
        ]
      ],
      //pais_id: [this.pais_id, [Validators.required]],
      anio: [this.anio, [Validators.required]],
      estado_id: [this.estado_id, [Validators.required]],
      catalogo_id: [this.catalogo_id, [Validators.required]],
      descripcion: [this.descripcion, [Validators.required]]
    };

    this.fb = new FormBuilder();
    const form = this.fb.group(group);

    //form.controls['estampilla_id'].setValue(0);
    form.controls['nombre'].setValue('');
    //form.controls['pais_id'].setValue(0);
    form.controls['anio'].setValue(0);
    form.controls['estado_id'].setValue(0);
    form.controls['descripcion'].setValue('');

    if (this.id !== -1) {
      //form.controls['estampilla_id'].setValue(this.estampilla['estampilla_id']);
      form.controls['nombre'].setValue(this.estampilla[0].nombre);
      //form.controls['pais_id'].setValue(this.estampilla[0].pais_id);
      form.controls['anio'].setValue(this.estampilla[0].anio);
      form.controls['estado_id'].setValue(this.estampilla[0].estado_id);
      //form.controls['catalogo_id'].setValue(this.estampilla['catalogo_id']);
      form.controls['descripcion'].setValue(this.estampilla[0].descripcion);

      this.pais_id = this.estampilla[0].pais_id;
      console.log(this.pais_id);


      var aux = this.estampilla["variedades"];
      var temp = new Array();

      aux.forEach(function(element) {
        console.log(element);
        temp.push({
          estampilla_id: element.estampilla_id,
          estampilla_variedad_id: element.estampilla_variedad_id,
          codigo_yt: element.codigo_yt,
          codigo_arg: element.codigo_arg,
          variedad: element.nombre,
          precio: element.precio,
          precio2: element.precio2,
          precio3: element.precio3,
          precio4: element.precio4,
          precio5: element.precio5
        });
      });

      this.variedades = temp;

    }



    this.form = form;
    //this.form.valueChanges.subscribe(data => {
    //  this.formErrors = this.coreService.onValueChanged(
    //    data,
    //    form,
    //    this.formErrors,
    //    this.validationMessages
    //  );
    //});
    //
    //this.coreService.onValueChanged();
  }

  onActivate(e) {
    console.log(e);
  }

  //minSelectedCheckboxes(min = 1) {
  //  const validator: ValidatorFn = (formArray: FormArray) => {
  //    const totalSelected = formArray.controls
  //      // get a list of checkbox values (boolean)
  //      .map(control => control.value)
  //      // total up the number of checked checkboxes
  //      .reduce((prev, next) => (next ? prev + next : prev), 0);
  //
  //    // if the total is not greater than the minimum, return the error message
  //    return totalSelected >= min ? null : { required: true };
  //  };
  //
  //  return validator;
  //}

  updateEstampillaImages(e, id) {
    const _id = 'img' + id;
    //this.definicion[_id] = e[_id];
    //console.log(this.definicion);
  }

  loadedImage(e, index) {
    this.images[index] = e.originalName;
    console.log(this.images);
  }

  setImageName(_obj, val) {
    setTimeout(() => {
      this[_obj] = val;
    }, 0);
  }


  showHelp() {

  }

}
