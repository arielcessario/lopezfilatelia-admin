import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'ac-core';

@Component({
  selector: 'lfa-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  err: string;

  constructor(private authService: AuthenticationService) {}

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
}
