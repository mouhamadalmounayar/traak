import { builders, eq } from 'prosemirror-test-builder';
import { traakSchema } from '../../lib/builtins/schemas';
import { Node } from 'prosemirror-model';
import ist from 'ist';
import { Command, EditorState, Transaction } from 'prosemirror-state';
import {
  addList,
  addLine,
  addLineFromTitle,
  defaultRemove,
  exitList,
  joinTwoLines,
  liftList,
  removeLineNode,
  removeSelection,
} from '../../lib/builtins/commands';
import { createState, getTagObject, select } from '../__utils__';

const apply = (doc: Node, command: Command, result?: Node) => {
  let state = createState(doc);
  command(state, (tr: Transaction) => (state = state.apply(tr)));
  ist(state.doc, result || doc, eq);
  if (result && getTagObject(result).a != null)
    ist(state.selection, select(result), eq);
};
const traakBuilders = builders(traakSchema);

describe('basicTraakAddCommands', () => {
  let addBulletList: Command;
  beforeEach(() => {
    addBulletList = (
      state: EditorState,
      dispatch: ((tr: Transaction) => void) | undefined,
    ) => {
      return addList('bullet_list', state, dispatch);
    };
  });
  it('should add a line to the document', async () => {
    const doc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('Hello from traak<a>'),
    );
    const expectedResult = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('Hello from traak'),
      traakBuilders.line('<a>'),
    );
    apply(doc, addLine, expectedResult);
  });
  describe('addLineFromTitle', () => {
    it('should add a line without splitting the title if there is no node after the title', async () => {
      const doc = traakBuilders.doc(traakBuilders.doc_title('Page t<a>itle'));
      const expectedResult = traakBuilders.doc(
        traakBuilders.doc_title('Page title'),
        traakBuilders.line('<a>'),
      );
      apply(doc, addLineFromTitle, expectedResult);
    });
    it('doc should not be updated if there is a node after the title', async () => {
      const doc = traakBuilders.doc(
        traakBuilders.doc_title('Page title'),
        traakBuilders.line('Hello from traak'),
      );
      apply(doc, addLineFromTitle);
    });
  });
  it('should add a bullet list to the doc', async () => {
    const doc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('Hello from traak<a>'),
    );
    const expectedResult = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('Hello from traak'),
      traakBuilders.bullet_list(traakBuilders.list_item()),
    );
    apply(doc, addBulletList, expectedResult);
  });
});

describe('basicTraakRemoveCommands', () => {
  it('should remove a letter from the line', async () => {
    const doc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('Hello from tra<a>ak'),
    );
    const expectedResult = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('Hello from trak'),
    );
    apply(doc, defaultRemove, expectedResult);
  });
  it('should remove a line from the document', async () => {
    const doc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('hello'),
      traakBuilders.line('<a>'),
    );
    const expectedResult = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('hello'),
    );
    apply(doc, removeLineNode, expectedResult);
  });
  it('should join two lines', async () => {
    const doc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('hello from traak'),
      traakBuilders.line('<a>hello from traak'),
    );
    const expectedResult = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('hello from traakhello from traak'),
      traakBuilders.line(),
    );
    apply(doc, joinTwoLines, expectedResult);
  });
  it('should exit the list to a new line', async () => {
    const doc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('hello from traak'),
      traakBuilders.bullet_list(
        traakBuilders.list_item('item1'),
        traakBuilders.list_item('<a>'),
      ),
    );
    const expectedResult = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('hello from traak'),
      traakBuilders.bullet_list(traakBuilders.list_item('item1')),
      traakBuilders.line(),
    );
    apply(doc, exitList, expectedResult);
  });
  it('should copy the contents of the list item to a new line', async () => {
    const doc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('hello from traak'),
      traakBuilders.bullet_list(
        traakBuilders.list_item('item1'),
        traakBuilders.list_item('<a>item2'),
      ),
    );
    const expectedResult = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('hello from traak'),
      traakBuilders.bullet_list(traakBuilders.list_item('item1')),
      traakBuilders.line('item2'),
    );
    apply(doc, liftList, expectedResult);
  });

  it('shoud remove selection from the document', async () => {
    const doc = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line('<a>Hello from<b> traak'),
    );
    const expectedResult = traakBuilders.doc(
      traakBuilders.doc_title('Page title'),
      traakBuilders.line(' traak'),
    );
    apply(doc, removeSelection, expectedResult);
  });
});
