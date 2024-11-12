import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopDentistComponent } from './cop-dentist.component';

describe('CopDentistComponent', () => {
  let component: CopDentistComponent;
  let fixture: ComponentFixture<CopDentistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopDentistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopDentistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
