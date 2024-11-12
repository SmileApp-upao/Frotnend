import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaLayoutComponent } from './cita-layout.component';

describe('CitaLayoutComponent', () => {
  let component: CitaLayoutComponent;
  let fixture: ComponentFixture<CitaLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
