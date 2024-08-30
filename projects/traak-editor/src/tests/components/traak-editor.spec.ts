import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TraakEditorComponent } from '../../lib/components/traak-editor/traak-editor.component';


describe('TraakEditorComponent', () => {
  let component: TraakEditorComponent;
  let fixture: ComponentFixture<TraakEditorComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TraakEditorComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TraakEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call handleNodeHover when nodeHover is dispatched', () => {
    const handleNodeHoverSpy = jest.spyOn(component, 'handleNodeHover');
    fixture.debugElement.nativeElement.dispatchEvent(
      new CustomEvent('nodeHover'),
    );
    expect(handleNodeHoverSpy).toHaveBeenCalled();
  });

  it('should call hanldeNodeOut when nodeOut is dispatched', () => {
    const handleNodeOutSpy = jest.spyOn(component, 'handleNodeOut');
    fixture.debugElement.nativeElement.dispatchEvent(
      new CustomEvent('nodeOut'),
    );
    expect(handleNodeOutSpy).toHaveBeenCalled();
  });

  it('should forward the event on hover', (done) => {
    const $event = new CustomEvent('nodeHover');
    component.nodeHoverEvent.subscribe((value) => {
      expect(value).toEqual($event);
      done();
    });
    component.handleNodeHover($event);
  });

  it('should forward the event on out', (done) => {
    const $event = new CustomEvent('nodeOut');
    component.nodeOutEvent.subscribe((value) => {
      expect(value).toEqual($event);
      done();
    });
    component.handleNodeOut($event);
  });
});
