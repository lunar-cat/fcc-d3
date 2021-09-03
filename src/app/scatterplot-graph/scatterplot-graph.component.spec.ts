import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterplotGraphComponent } from './scatterplot-graph.component';

describe('ScatterplotGraphComponent', () => {
  let component: ScatterplotGraphComponent;
  let fixture: ComponentFixture<ScatterplotGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterplotGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterplotGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
