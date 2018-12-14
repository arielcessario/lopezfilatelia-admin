import { EstampillaComponent } from './estampilla/estampilla.component';
import { EstampillasComponent } from './estampillas/estampillas.component';
import { LoginComponent } from './login/login.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'ac-core';
import { MainComponent } from './main/main.component';
import { PaisesComponent } from './paises/paises.component';
import { PaisComponent } from './pais/pais.component';
import { LotesComponent } from './lotes/lotes.component';
import { LoteComponent } from './lote/lote.component';
import { ColoresComponent } from './colores/colores.component';
import { ColorComponent } from './color/color.component'


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'estampillas',
    component: EstampillasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'estampilla',
    component: EstampillaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'estampilla/:id',
    component: EstampillaComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'paises',
    component: PaisesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pais',
    component: PaisComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pais/:id',
    component: PaisComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'lotes',
    component: LotesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lote',
    component: LoteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lote/:id',
    component: LoteComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'colores',
    component: ColoresComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'color',
    component: ColorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'color/:id',
    component: ColorComponent,
    //canActivate: [AuthGuard]
  },
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
