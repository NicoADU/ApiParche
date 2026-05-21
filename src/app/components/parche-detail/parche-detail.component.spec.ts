import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcheDetailComponent } from './parche-detail.component';

describe('ParcheDetailComponent', () => {
  let component: ParcheDetailComponent;
  let fixture: ComponentFixture<ParcheDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcheDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcheDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
