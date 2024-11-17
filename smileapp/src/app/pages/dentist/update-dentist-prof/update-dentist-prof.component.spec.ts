import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDentistProfComponent } from './update-dentist-prof.component';

describe('UpdateDentistProfComponent', () => {
  let component: UpdateDentistProfComponent;
  let fixture: ComponentFixture<UpdateDentistProfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDentistProfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDentistProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
