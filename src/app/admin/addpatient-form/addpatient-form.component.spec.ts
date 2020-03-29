import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpatientFormComponent } from './addpatient-form.component';

describe('AddpatientFormComponent', () => {
  let component: AddpatientFormComponent;
  let fixture: ComponentFixture<AddpatientFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpatientFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpatientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
