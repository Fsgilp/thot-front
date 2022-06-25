import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoTestComponent } from './do-test.component';

describe('DoTestComponent', () => {
  let component: DoTestComponent;
  let fixture: ComponentFixture<DoTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
