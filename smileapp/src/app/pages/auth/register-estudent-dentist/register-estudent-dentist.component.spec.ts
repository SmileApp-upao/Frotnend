import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEstudentDentistComponent } from './register-estudent-dentist.component';

describe('RegisterEstudentDentistComponent', () => {
  let component: RegisterEstudentDentistComponent;
  let fixture: ComponentFixture<RegisterEstudentDentistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterEstudentDentistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterEstudentDentistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
