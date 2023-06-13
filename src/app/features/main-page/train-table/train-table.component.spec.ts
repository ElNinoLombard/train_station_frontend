import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainTableComponent } from './train-table.component';

describe('TrainTableComponent', () => {
  let component: TrainTableComponent;
  let fixture: ComponentFixture<TrainTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
