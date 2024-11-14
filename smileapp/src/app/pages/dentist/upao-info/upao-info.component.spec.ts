import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpaoInfoComponent } from './upao-info.component';

describe('UpaoInfoComponent', () => {
  let component: UpaoInfoComponent;
  let fixture: ComponentFixture<UpaoInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpaoInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpaoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
