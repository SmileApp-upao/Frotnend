import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCuentaComponent } from './tipo-cuenta.component';

describe('TipoCuentaComponent', () => {
  let component: TipoCuentaComponent;
  let fixture: ComponentFixture<TipoCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
