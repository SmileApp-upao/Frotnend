import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDentistEstuComponent } from './update-dentist-estu.component';

describe('UpdateDentistEstuComponent', () => {
  let component: UpdateDentistEstuComponent;
  let fixture: ComponentFixture<UpdateDentistEstuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDentistEstuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDentistEstuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
