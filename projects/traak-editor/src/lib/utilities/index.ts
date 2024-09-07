import { EditorView } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';

function getResolvedPos(view: EditorView) {
  const { state } = view;
  const { selection } = state;
  const { $from } = selection;
  return $from;
}

/**
 * returns the type of the current node.
 * @param view
 */
export function getNodeType(view: EditorView): string {
  const $nodePos = getResolvedPos(view);
  return $nodePos.parent.type.name;
}

/**
 * returns the current node.
 * @param view
 */
export function getNode(view: EditorView) {
  const $nodePos = getResolvedPos(view);
  return $nodePos.parent;
}

/**
 * returns true if the node is empty. False otherwise.
 * @param view
 */
export function isNodeEmpty(view: EditorView) {
  const $nodePos = getResolvedPos(view);
  return $nodePos.parent.content.size === 0;
}

/**
 * returns true if the cursor is at the start of the current node.
 * @param view
 */
export function isCursorAtStartOfNode(view: EditorView) {
  const $nodePos = getResolvedPos(view);
  return $nodePos.pos === $nodePos.before() + 1;
}

/**
 * dispatches a transaction that moves the cursor to the end of the current node.
 * @param view
 */
export function moveCursorToEndOfNode(view: EditorView) {
  const { state } = view;
  const { tr } = state;
  const $nodePos = getResolvedPos(view);
  tr.setSelection(
    TextSelection.create(
      tr.doc,
      $nodePos.node().nodeSize + 1,
      $nodePos.node().nodeSize + 1,
    ),
  );
  view.dispatch(tr);
}
