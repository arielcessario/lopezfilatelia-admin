import { EstampillaComponent } from './estampilla/estampilla.component';
import { EstampillasComponent } from './estampillas/estampillas.component';
import { LoginComponent } from './login/login.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'ac-core';
import { MainComponent } from './main/main.component';

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
    canActivate: [AuthGuard]
  }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);