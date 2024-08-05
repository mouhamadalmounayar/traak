import { traakStarter } from '../src/lib/builtins/starters';
import { traakSchema } from '../src/lib/builtins/schemas';

import { addLine, addLineFromTitle, joinTwoLines } from '../src/lib/builtins/commands';
import { TextSelection, Transaction } from 'prosemirror-state';
import {createState} from "./test-utils";



describe('test addLineFromTitle', () => {
  it('if there is a next line, cursor hops to the beginning of the next line', async () => {
    let state = createState(traakSchema, traakStarter);
    const tr = state.tr;
    const { selection } = state;
    const { $from } = selection;
    tr.setSelection(TextSelection.create(tr.doc, $from.pos + 2, $from.pos + 2));
    const result = addLineFromTitle(
      state,
      (tr: Transaction) => (state = state.apply(tr)),
    );
    expect(result).toBe(true);
    expect(state.selection.from).toEqual(13);
  });

  it('if there is no next line, a new line is created', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'doc_title',
          content: [{ type: 'text', text: 'Page Title' }],
        },
      ],
    };
    let state = createState(traakSchema, doc);
    const tr = state.tr;
    const { selection } = state;
    const { $from } = selection;
    tr.setSelection(TextSelection.create(tr.doc, $from.pos + 2, $from.pos + 2));
    const result = addLineFromTitle(
      state,
      (tr: Transaction) => (state = state.apply(tr)),
    );
    expect(result).toBe(true);
    expect(state.selection.$from.pos).toEqual($from.node().nodeSize + 1);
  });
});

describe('test addLine', () => {
  it('should add a line to the document', () => {
    let state = createState(traakSchema, traakStarter);
    const tr = state.tr;
    tr.setSelection(
      TextSelection.create(
        tr.doc,
        tr.doc.content.size - 1,
        tr.doc.content.size - 1,
      ),
    );
    state = state.apply(tr);
    const result = addLine(
      state,
      (tr: Transaction) => (state = state.apply(tr)),
    );
    expect(result).toBe(true);
    expect(state.doc.childCount);
    expect(state.doc.content.child(2).type.name).toBe('line');
    expect(state.doc.content.child(2).content.size).toEqual(0);
  });
});

describe('test join lines', () => {
  it('should join two lines', () => {
    // pushing an extra line to the starter.
    traakStarter.content.push({
      type: 'line',
      content: [{ type: 'text', text: 'Hello from traak' }],
    });
    let state = createState(traakSchema, traakStarter);
    const tr = state.tr;
    // getting the position of the start of the second line.
    const childCount = state.doc.childCount;
    let pos = 1;
    for (let i = 0; i < childCount - 1; i++) {
      pos += state.doc.child(i).nodeSize;
    }
    tr.setSelection(TextSelection.create(tr.doc, pos, pos));
    state = state.apply(tr);
    const result = joinTwoLines(
      state,
      (tr: Transaction) => (state = state.apply(tr)),
    );
    expect(result).toBe(true);
    expect(state.doc.childCount).toEqual(3);
    expect(state.doc.child(2).nodeSize).toEqual(2); // only start and end token remain.
    expect(state.doc.child(1).child(0).text).toEqual(
      'Hello from traakHello from traak',
    );
  });
});
// add tests for the rest of the commands.
