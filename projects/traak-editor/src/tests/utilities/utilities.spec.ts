import { builders, eq } from 'prosemirror-test-builder';
import { traakSchema } from '../../lib/builtins/schemas';
import { createView, createState } from '../__utils__';
import ist from 'ist';
import { TraakManager } from '../../lib/utilities';
import { Tree } from '../../types/tree';

describe('Node utilities', () => {
  const traakBuilders = builders(traakSchema);
  describe('getNodeType', () => {
    it('should return line', () => {
      const doc = traakBuilders.doc(traakBuilders.line('Hello from<a> traak'));
      const view = createView(createState(doc));
      const manager = new TraakManager(view);
      const result = manager.getNodeType();
      expect(result).toEqual('line');
    });
    it('should return list-item', () => {
      const doc = traakBuilders.doc(
        traakBuilders.bullet_list(
          traakBuilders.list_item('Hello <a> from traak'),
        ),
      );
      const view = createView(createState(doc));
      const manager = new TraakManager(view);
      const result = manager.getNodeType();
      expect(result).toEqual('list_item');
    });
    it('should return doc_title', () => {
      const doc = traakBuilders.doc(traakBuilders.doc_title('Page<a> title'));
      const view = createView(createState(doc));
      const manager = new TraakManager(view);
      const result = manager.getNodeType();
      expect(result).toEqual('doc_title');
    });
  });
  describe('isNodeEmpty', () => {
    it('should return true for empty node', async () => {
      const doc = traakBuilders.doc(traakBuilders.line());
      const view = createView(createState(doc));
      const manager = new TraakManager(view);
      const result = manager.isNodeEmpty();
      expect(result).toEqual(true);
    });
    it('should return false for a non empty node', async () => {
      const doc = traakBuilders.doc(traakBuilders.line('Hello from traak<a>'));
      const view = createView(createState(doc));
      const manager = new TraakManager(view);
      const result = manager.isNodeEmpty();
      expect(result).toEqual(false);
    });
  });
  describe('isCursorAtStartOfNode', () => {
    it('should return true for cursor at start of node', async () => {
      const doc = traakBuilders.doc(traakBuilders.line('<a>Hello from traak'));
      const view = createView(createState(doc));
      const manager = new TraakManager(view);
      const result = manager.isCursorAtStartOfNode();
      expect(result).toEqual(true);
    });
    it('should return false for cursor at middle of node', async () => {
      const doc = traakBuilders.doc(traakBuilders.line('Hello <a> from traak'));
      const view = createView(createState(doc));
      const manager = new TraakManager(view);
      const result = manager.isCursorAtStartOfNode();
      expect(result).toEqual(false);
    });
  });
  describe('moveCursorToEndOfNode', () => {
    it('should move cursor to the end of the current node', async () => {
      const doc = traakBuilders.doc(
        traakBuilders.line('Hello<a>from traak'),
        traakBuilders.line(''),
      );
      const view = createView(createState(doc));
      const expectedDoc = traakBuilders.doc(
        traakBuilders.line('Hellofrom traak<a>'),
        traakBuilders.line(''),
      );
      const manager = new TraakManager(view);
      manager.moveCursorToEndOfNode();
      ist(view.state.doc, expectedDoc, eq);
    });
  });
  describe('addNode', () => {
    it('should add a node at the current selection', async () => {
      const doc = traakBuilders.doc(traakBuilders.line('Hello from traak<a>'));
      const view = createView(createState(doc));
      const manager = new TraakManager(view);
      manager.addNode(new Tree('line', traakSchema));
      const expectedDoc = traakBuilders.doc(
        traakBuilders.line('Hello from traak'),
        traakBuilders.line(),
      );
      ist(view.state.doc, expectedDoc, eq);
    });
  });
});
