import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateParcheComponent } from './create-parche.component';

describe('CreateParcheComponent', () => {
  let component: CreateParcheComponent;
  let fixture: ComponentFixture<CreateParcheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateParcheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateParcheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
