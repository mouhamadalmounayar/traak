import { EditorView } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';

function getResolvedPos(view: EditorView) {
  const { state } = view;
  const { selection } = state;
  const { $from } = selection;
  return $from;
}

export function getNodeType(view: EditorView): string {
  const $nodePos = getResolvedPos(view);
  return $nodePos.parent.type.name;
}

export function getNode(view: EditorView) {
  const $nodePos = getResolvedPos(view);
  return $nodePos.parent;
}

export function isNodeEmpty(view: EditorView) {
  const $nodePos = getResolvedPos(view);
  return $nodePos.parent.content.size === 0;
}

export function isCursorAtStartOfNode(view: EditorView) {
  const $nodePos = getResolvedPos(view);
  return $nodePos.pos === $nodePos.before() - 1;
}

export function moveCursorToEndOfNode(view: EditorView) {
  const { state } = view;
  const { tr } = state;
  const $nodePos = getResolvedPos(view);
  tr.setSelection(
    TextSelection.create(
      tr.doc,
      $nodePos.parent.nodeSize + 1,
      $nodePos.parent.nodeSize + 1,
    ),
  );
}
