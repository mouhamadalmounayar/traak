import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ToolTipComponent } from '../../lib/traakPlugins/tooltip/tooltip.component';

describe('tootltip', () => {
  let component: ToolTipComponent;
  let fixture: ComponentFixture<ToolTipComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToolTipComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ToolTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should be create successfully', () => {
    expect(component).toBeTruthy();
  });
});
