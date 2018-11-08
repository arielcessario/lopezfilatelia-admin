import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstampillasComponent } from './estampillas.component';

describe('EstampillasComponent', () => {
  let component: EstampillasComponent;
  let fixture: ComponentFixture<EstampillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstampillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstampillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
