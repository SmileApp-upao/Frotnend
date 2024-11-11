import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeDentistComponent } from './type-dentist.component';

describe('TypeDentistComponent', () => {
  let component: TypeDentistComponent;
  let fixture: ComponentFixture<TypeDentistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeDentistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeDentistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
