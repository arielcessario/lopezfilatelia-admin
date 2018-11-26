import { LoginComponent } from './login/login.component';
import { environment } from './../environments/environment';
import { Routing } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AppComponent } from './app.component';
import {
  NbThemeModule,
  NbLayoutModule,
  NbSidebarModule,
  NbSidebarService,
  NbCardModule,
  NbMenuModule,
  NbMenuItem,
  NbCheckboxModule
} from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AcCoreModule, AuthenticationService } from 'ac-core';
import { LopezfilateliaAdminCoreModule, LopezfilateliaAdminProxy } from 'lopezfilatelia-admin-core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstampillasComponent } from './estampillas/estampillas.component';
import { NbMenuInternalService, NbMenuService } from '@nebular/theme/components/menu/menu.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { EstampillaComponent } from './estampilla/estampilla.component';
import { PaisesComponent } from './paises/paises.component';
import { PaisComponent } from './pais/pais.component';
import { LotesComponent } from './lotes/lotes.component';
import { LoteComponent } from './lote/lote.component';
import { ToasterModule, ToasterService } from 'angular2-toaster';


let env = 'dev';
if (environment.production) {
  env = 'prod';
}

const projectConfig = {
  env: env,
  company: 'lopezfilatelia-admin',
  providers: [],
  imagesPath: environment.imagesPath
};

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    EstampillasComponent,
    EstampillaComponent,
    PaisesComponent,
    LotesComponent,
    LoteComponent,
    PaisComponent
  ],
  imports: [
    BrowserModule,
    NbThemeModule.forRoot({ name: 'default' }),
    FormsModule,
    ReactiveFormsModule,
    Routing,
    NbLayoutModule,
    NbSidebarModule,
    NbMenuModule.forRoot(),
    NbCardModule,
    AcCoreModule.forRoot(projectConfig),
    LopezfilateliaAdminCoreModule,
    BrowserAnimationsModule,
    TooltipModule.forRoot(),
    NbCheckboxModule,
    Ng2SmartTableModule,
    ToasterModule.forRoot(),
  ],
  providers: [NbSidebarService, LopezfilateliaAdminProxy],
  bootstrap: [AppComponent]
})
export class AppModule {}
