import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreemapDiagramComponent } from './treemap-diagram.component';

describe('TreemapDiagramComponent', () => {
  let component: TreemapDiagramComponent;
  let fixture: ComponentFixture<TreemapDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreemapDiagramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreemapDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
