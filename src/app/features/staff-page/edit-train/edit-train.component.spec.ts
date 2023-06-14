import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrainComponent } from './edit-train.component';

describe('EditTrainComponent', () => {
  let component: EditTrainComponent;
  let fixture: ComponentFixture<EditTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTrainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
