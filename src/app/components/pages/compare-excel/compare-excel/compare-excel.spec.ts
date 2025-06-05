import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareExcel } from './compare-excel';

describe('CompareExcel', () => {
  let component: CompareExcel;
  let fixture: ComponentFixture<CompareExcel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareExcel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareExcel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
