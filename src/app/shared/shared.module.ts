import { AcCoreModule } from 'ac-core';
import { FusejsPipe } from './fusejs/fusejs.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbCardModule,
  NbLayoutModule,
  NbActionsModule,
  NbUserModule,
  NbSearchModule
} from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    FusejsPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbLayoutModule,
    NbActionsModule,
    NbUserModule,
    NbSearchModule,
    NgbModule.forRoot(),
    AcCoreModule
  ],
  exports: [
    FusejsPipe
  ],
  entryComponents: [],
  providers: [],
  bootstrap: []
})
export class SharedModule {}
