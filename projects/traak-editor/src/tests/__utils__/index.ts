import {
  EditorState,
  NodeSelection,
  TextSelection,
  Selection,
} from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export function createState(doc: Node) {
  return EditorState.create({
    doc: doc,
    selection: select(doc),
  });
}
export function getTagObject(node: Node) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (node as any).tag;
}
export function select(doc: Node) {
  const a = getTagObject(doc).a;
  if (a != null) {
    const $a = doc.resolve(a);
    if ($a.parent.inlineContent) {
      return new TextSelection(
        $a,
        getTagObject(doc).b != null
          ? doc.resolve(getTagObject(doc).b)
          : undefined,
      );
    } else {
      return new NodeSelection($a);
    }
  }
  return Selection.atStart(doc);
}

export function createView(state: EditorState) {
  return new EditorView(document.createElement('div'), {
    state: state,
  });
}
