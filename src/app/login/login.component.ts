import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'ac-core';
import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';


@Component({
  selector: 'lfa-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  password: string;
  err: string;

  public email = '';

  constructor(private authService: AuthenticationService,
              private proxy: LopezfilateliaAdminProxy) {

              }

  ngOnInit() {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      data => {
        console.log('data', data);
      },
      error => {
        console.log(error);
        this.err = error;
        setTimeout(() => (this.err = undefined), 4000);
      }
    );
  }

  resetPassword() {
    if (this.email.trim().length === 0) {
        this.err = 'El mail es obligatorio';
        setTimeout(() => (this.err = undefined), 4000);
        return;
    }

    const usuario = {
      nombre: 'Mateo Maneff',
      mail: this.email.trim(),
      admin: true
    };

    this.proxy.filateliaResetPassword(usuario).subscribe(
            data => {
                // console.log(data);
            },
            error => {
                this.err = error;
                setTimeout(() => (this.err = undefined), 4000);
        }
    );
  }

}
