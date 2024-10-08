import { MenuComponent } from '../../lib/traak-plugins/menu/menu.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { builders, eq } from 'prosemirror-test-builder';
import { traakSchema } from '../../lib/builtins/schemas';
import { createState, createView, select } from '../__utils__';
import { EditorState } from 'prosemirror-state';
import ist from 'ist';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  BulletList,
  ListItem,
  OrderedList,
  Line,
  TaskCheckbox,
  TaskList,
} from '../../lib/nodes ';
const traakBuilders = builders(traakSchema);
const doc = traakBuilders.doc(
  traakBuilders.doc_title('Page title'),
  traakBuilders.line('<a>Hello from traak'),
);

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let state: EditorState;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MenuComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    component.isPluginVisible = true;
    component.config = {
      styles: {
        'inject-css': true,
      },
      nodes: [ListItem, BulletList, OrderedList, TaskCheckbox, TaskList, Line],
    };
    component.coordinates = { top: 0, left: 0, right: 0, bottom: 0 };
    state = createState(doc);
    fixture.detectChanges();
  });

  it('should create component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should call the addLine on click', () => {
    const addLineSpy = jest.spyOn(component, 'addLine');
    const button = fixture.debugElement.nativeElement.querySelector(
      '[test-id="line-menu-element"]',
    );
    button.click();
    expect(addLineSpy).toHaveBeenCalled();
  });

  it('should call the addBulletList on click', () => {
    const addBulletListSpy = jest.spyOn(component, 'addBulletList');
    const button = fixture.debugElement.nativeElement.querySelector(
      '[test-id="bullet-list-menu-element"]',
    );
    button.click();
    expect(addBulletListSpy).toHaveBeenCalled();
  });

  it('should call the addOrderedList on click', () => {
    const addOrderedListSpy = jest.spyOn(component, 'addOrderedList');
    const button = fixture.debugElement.nativeElement.querySelector(
      '[test-id="ordered-list-menu-element"]',
    );
    button.click();
    expect(addOrderedListSpy).toHaveBeenCalled();
  });

  it('should call hideMenu on mouseleave event', () => {
    const hideMenuSpy = jest.spyOn(component, 'hideMenu');
    const container = fixture.debugElement.nativeElement.querySelector(
      '[test-id = "container"]',
    );
    container.dispatchEvent(new MouseEvent('mouseleave'));
    expect(hideMenuSpy).toHaveBeenCalled();
  });

  it('should set cursor to the end of the line', () => {
    component.view = createView(state);
    component.node = traakBuilders.line('<a>Hello from traak');
    component.start = select(doc).from;
    const expectedDoc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('Hello from traak<a>'),
    );
    component.setCursorToEndOfLine();
    ist(component.view.state.doc, expectedDoc, eq);
    ist(component.view.state.selection, select(expectedDoc), eq);
  });

  it('should add a bullet-list to the document', () => {
    component.view = createView(state);
    component.node = traakBuilders.line('<a>Hello from traak');
    component.start = select(doc).from;
    const expectedDoc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('Hello from traak'),
      traakBuilders.bullet_list(traakBuilders.list_item()),
    );
    component.addBulletList(new MouseEvent('click'));
    ist(component.view.state.doc, expectedDoc, eq);
  });

  it('should add an ordered_list to the document', () => {
    component.view = createView(state);
    component.node = traakBuilders.line('<a>Hello from traak');
    component.start = select(doc).from;
    const expectedDoc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('Hello from traak'),
      traakBuilders.ordered_list(traakBuilders.list_item()),
    );
    component.addOrderedList(new MouseEvent('click'));
    ist(component.view.state.doc, expectedDoc, eq);
  });

  it('should add a line to the document', () => {
    component.view = createView(state);
    component.node = traakBuilders.line('<a>Hello from traak');
    component.start = select(doc).from;
    component.addLine(new MouseEvent('click'));
    const expectedDoc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('Hello from traak'),
      traakBuilders.line('<a>'),
    );
    ist(component.view.state.doc, expectedDoc, eq);
    ist(component.view.state.selection, select(expectedDoc), eq);
  });
});
