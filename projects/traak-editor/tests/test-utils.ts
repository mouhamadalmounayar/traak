import {EditorState, TextSelection, Transaction} from 'prosemirror-state';
import { Node, Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

type Doc = {   type: string;   content: {     type: string;     content: {       type: string;       text: string;     }[];   }[]; }
export const createState = (schema: Schema, doc: Doc) => {
  return EditorState.create({
    doc: Node.fromJSON(schema, doc),
  });
};

export const createView = (
  state: EditorState,
  template: Element,
): EditorView => {
  const view = new EditorView(template, {
    state: state,
    dispatchTransaction(tr: Transaction) {
      const newState = view.state.apply(tr);
      view.updateState(newState);
    },
  });

  return view;
};

export const select = (tr:Transaction, from:number , to:number) => {
  tr.setSelection(TextSelection.create(tr.doc , from , to))
}
