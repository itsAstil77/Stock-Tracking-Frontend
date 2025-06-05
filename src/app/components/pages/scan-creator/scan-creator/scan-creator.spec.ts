import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanCreator } from './scan-creator';

describe('ScanCreator', () => {
  let component: ScanCreator;
  let fixture: ComponentFixture<ScanCreator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanCreator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanCreator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
