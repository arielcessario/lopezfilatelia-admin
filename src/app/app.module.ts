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
  NbCheckboxModule,
  NbListModule
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColoresComponent } from './colores/colores.component';
import { ColorComponent } from './color/color.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidoComponent } from './pedido/pedido.component';
import { UsuariosLotesComponent } from './usuarioslotes/usuarioslotes.component';
import { UsuarioLoteComponent } from './usuariolote/usuariolote.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { SharedModule } from './shared/shared.module';
import { FusejsService } from './core/fusejs.service';


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
    PaisComponent,
    ColoresComponent,
    ColorComponent,
    PedidosComponent,
    PedidoComponent,
    UsuariosLotesComponent,
    UsuarioLoteComponent,
    UsuariosComponent,
    UsuarioComponent
  ],
  imports: [
    BrowserModule,
    // NbThemeModule.forRoot({ name: 'default' }),
    NbThemeModule.forRoot({ name: 'corporate' }),
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
    NgbModule.forRoot(),
    SharedModule,
    NbListModule
  ],
  providers: [
    NbSidebarService,
    NbMenuService,
    LopezfilateliaAdminProxy,
    NgbModalConfig,
    NgbModal,
    FusejsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
