import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaDetailsComponent } from './cita-details.component';

describe('CitaDetailsComponent', () => {
  let component: CitaDetailsComponent;
  let fixture: ComponentFixture<CitaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
