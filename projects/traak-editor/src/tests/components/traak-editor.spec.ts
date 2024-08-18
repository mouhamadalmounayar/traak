import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TraakEditorComponent } from '../../lib/components/traak-editor/traak-editor.component';
import { EditorView } from 'prosemirror-view';
import { builders, eq } from 'prosemirror-test-builder';
import { traakSchema } from '../../lib/builtins/schemas';
import ist from 'ist';

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

  it('should emit view', (done) => {
    component.viewEvent.subscribe((value) => {
      expect(value).toBeInstanceOf(EditorView);
      done();
    });
    component.initializeEditor();
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

  it('view should be initialized with the correct document', (done) => {
    const traakBuilders = builders(traakSchema);
    const doc = traakBuilders.doc(
      traakBuilders.doc_title('Page Title'),
      traakBuilders.line('Hello from traak'),
    );
    component.viewEvent.subscribe((view) => {
      ist(view.state.doc, doc, eq);
      done();
    });
    component.initializeEditor();
  });
});
