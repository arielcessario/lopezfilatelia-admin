import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService, AuthenticationService } from 'ac-core';
import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';

@Component({
  selector: 'lfa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  logged = false;

  menu: Array<any> = [
    {
      title: 'Administración',
      icon: 'nb-keypad',
      link: '/main',
      children: [
        {
          title: 'Estampillas',
          link: '/estampillas'
        }
      ]
    }
  ];

  constructor(
    private router: Router,
    private coreService: CoreService,
    private proxy: LopezfilateliaAdminProxy,
    private authService: AuthenticationService
  ) {}
  ngOnInit() {
    this.logged = this.authService.getLoginStatus();

    console.log(this.authService.getLoginStatus());

    this.proxy.getEstampillas().subscribe(data=>{
      console.log(data);

    })

    this.coreService.getLoginStatus.subscribe(data => {
      this.logged = data;
      if (!data) {
        this.router.navigate(['/login']);
        // this.selectedNavLink = '/login';
        // this.sharedService.navigateTo('/login');
      } else {
        this.router.navigate(['/main']);
        // this.selectedNavLink = '/cotizador';
        // this.sharedService.navigateTo('/cotizador');
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
