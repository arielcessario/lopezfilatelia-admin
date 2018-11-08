import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstampillaComponent } from './estampilla.component';

describe('EstampillaComponent', () => {
  let component: EstampillaComponent;
  let fixture: ComponentFixture<EstampillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstampillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstampillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
