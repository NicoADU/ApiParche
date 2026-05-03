import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CreateParcheComponent } from './create-parche.component';

describe('CreateParcheComponent', () => {
  let component: CreateParcheComponent;
  let fixture: ComponentFixture<CreateParcheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateParcheComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
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
