import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService, AuthenticationService } from 'ac-core';
import { LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';
import {
    NbMediaBreakpoint,
    NbMediaBreakpointsService,
    NbMenuItem,
    NbMenuService,
    NbSidebarService,
    NbThemeService,
} from '@nebular/theme';
// import { StateService } from '../../../@core/data/state.service';

import {
    ToasterService,
    ToasterConfig,
    Toast,
    BodyOutputType
} from 'angular2-toaster';

@Component({
  selector: 'lfa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // title = 'app';
  logged = false;

  position = 'toast-top-center';
  animationType = 'fade';
  title = 'HI there!';
  content = `I'm cool toaster!`;
  timeout = 5000;
  toastsLimit = 5;
  type = 'default';
  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;

  config: ToasterConfig = new ToasterConfig({
    positionClass: this.position,
    timeout: this.timeout,
    newestOnTop: this.isNewestOnTop,
    tapToDismiss: this.isHideOnClick,
    preventDuplicates: this.isDuplicatesPrevented,
    animation: this.animationType,
    limit: this.toastsLimit
  });

  types: string[] = ['default', 'info', 'success', 'warning', 'error'];
  animations: string[] = [
    'fade',
    'flyLeft',
    'flyRight',
    'slideDown',
    'slideUp'
  ];
  positions: string[] = [
    'toast-top-full-width',
    'toast-bottom-full-width',
    'toast-top-left',
    'toast-top-center',
    'toast-top-right',
    'toast-bottom-right',
    'toast-bottom-center',
    'toast-bottom-left',
    'toast-center'
  ];

  menu: Array<any> = [
    {
      title: 'Administración',
      icon: 'nb-keypad',
      link: '/main',
      children: [
        {
          title: 'Estampillas',
          link: '/estampillas'
        },
        {
          title: 'Lotes',
          link: '/lotes'
        },
        {
          title: 'Pedidos',
          link: '/pedidos'
        },
        {
          title: 'Ofertas',
          link: '/usuarioslotes'
        },
        {
          title: 'Usuarios',
          link: '/usuarios'
        },
        {
          title: 'Paises',
          link: '/paises'
        },
        {
          title: 'Colores',
          link: '/colores'
        },
      ],
    }
  ];


  sidebar: any = {};
  private alive = true;
  currentTheme: string;


  private toasterService: ToasterService;

  constructor(
    private router: Router,
    private coreService: CoreService,
    private proxy: LopezfilateliaAdminProxy,
    private authService: AuthenticationService,
    toasterService: ToasterService,
    // protected menuService: NbMenuService,
    // protected themeService: NbThemeService,
    // protected bpService: NbMediaBreakpointsService,
    protected sidebarService: NbSidebarService) {

      this.toasterService = toasterService;

      this.coreService.showToast.subscribe(toast => {
        this.makeToast(toast);
      });

  }


  ngOnInit() {
    this.logged = this.authService.getLoginStatus();

    this.coreService.getLoginStatus.subscribe(data => {
      this.logged = data;
      if (!data) {
        this.router.navigate(['/login']);
        // this.selectedNavLink = '/login';
        // this.sharedService.navigateTo('/login');
      } else {
        // this.router.navigate(['/main']);
        this.router.navigate(['/estampillas']);
        // this.selectedNavLink = '/cotizador';
        // this.sharedService.navigateTo('/cotizador');
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  makeToast(toast) {
    this.showToast(toast.type, toast.title, toast.body);
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      positionClass: this.position,
      timeout: this.timeout,
      newestOnTop: this.isNewestOnTop,
      tapToDismiss: this.isHideOnClick,
      preventDuplicates: this.isDuplicatesPrevented,
      animation: this.animationType,
      limit: this.toastsLimit
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: this.timeout,
      showCloseButton: this.isCloseButton,
      bodyOutputType: BodyOutputType.TrustedHtml
    };
    this.toasterService.popAsync(toast);
  }

  toggle() {
    this.sidebarService.toggle();
  }


}
