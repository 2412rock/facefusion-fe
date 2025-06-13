import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapComponent } from './swap.component';

describe('SwapComponent', () => {
  let component: SwapComponent;
  let fixture: ComponentFixture<SwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
