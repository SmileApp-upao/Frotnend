import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProfesionalDentistComponent } from './register-profesional-dentist.component';

describe('RegisterProfesionalDentistComponent', () => {
  let component: RegisterProfesionalDentistComponent;
  let fixture: ComponentFixture<RegisterProfesionalDentistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterProfesionalDentistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterProfesionalDentistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
