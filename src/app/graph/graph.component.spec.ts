import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GRAPHComponent } from './graph.component';

describe('GRAPHComponent', () => {
  let component: GRAPHComponent;
  let fixture: ComponentFixture<GRAPHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GRAPHComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GRAPHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
