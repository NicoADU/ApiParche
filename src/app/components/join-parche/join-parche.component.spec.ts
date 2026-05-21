import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinParcheComponent } from './join-parche.component';

describe('JoinParcheComponent', () => {
  let component: JoinParcheComponent;
  let fixture: ComponentFixture<JoinParcheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinParcheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinParcheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
