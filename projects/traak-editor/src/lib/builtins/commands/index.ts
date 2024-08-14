import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { chainCommands } from 'prosemirror-commands';

export function addLine(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { schema, selection } = state;
  const { $from } = selection;
  const lineNode = schema.nodes['line'].create();
  if (lineNode) {
    const tr = state.tr.insert($from.pos, lineNode).scrollIntoView();
    const newPos = $from.pos + 2 + lineNode.content.size;
    tr.setSelection(
      TextSelection.create(tr.doc, newPos, newPos),
    ).scrollIntoView();
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  }
  return false;
}

export function addLineFromTitle(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { schema, selection } = state;
  const { $from } = selection;
  if ($from.node().type.name === 'doc_title') {
    if ($from.node().nodeSize + 1 < $from.doc.content.size) {
      const tr = state.tr;
      tr.setSelection(
        TextSelection.create(
          tr.doc,
          $from.node().nodeSize + 1,
          $from.node().nodeSize + 1,
        ),
      );
      if (dispatch) dispatch(tr);
      return true;
    } else {
      const lineNode = schema.nodes['line'].create();
      const tr = state.tr.insert($from.node().nodeSize, lineNode);
      tr.setSelection(
        TextSelection.create(
          tr.doc,
          $from.node().nodeSize + 1,
          $from.node().nodeSize + 1,
        ),
      );
      if (dispatch) dispatch(tr);
      return true;
    }
  }
  return false;
}

export function removeLineNode(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { selection } = state;
  const { $from, $to } = selection;
  const currNode = $from.doc.nodeAt($from.pos);
  // if the cursor is at the beginning of the line and the line is empty. We delete the line.
  if (
    $from.pos === $to.pos &&
    $from.pos === $from.before() + 1 &&
    currNode === null
  ) {
    const tr = state.tr.delete($from.pos - 1, $from.pos);
    if (dispatch) dispatch(tr);
    return true;
  }
  return false;
}

export function joinTwoLines(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { selection } = state;
  const { $from, $to } = selection;
  // if the cursor is at the beginning and the line is not empty. We join the line with the one before.
  if ($from.pos === $to.pos && $from.pos === $from.before() + 1) {
    const nodeBefore = $from.doc.resolve($from.before()).nodeBefore;
    if (
      nodeBefore &&
      (nodeBefore.type.name === 'doc_title' || nodeBefore.type.name === 'line')
    ) {
      const currNode = $from.doc.nodeAt($from.pos);
      if (currNode && currNode.text) {
        const tr = state.tr
          .delete($from.pos, $from.pos + currNode.nodeSize)
          .insertText(currNode.text, $from.pos - 2);
        tr.setSelection(TextSelection.create(tr.doc, $from.pos - 2));
        if (dispatch) dispatch(tr);
      }
      return true;
    }
  }
  return false;
}

export function removeSelection(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  // if we want to remove a selection.
  const { selection } = state;
  const { $from, $to } = selection;
  const tr = state.tr.delete($from.pos, $to.pos);
  if (dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
}

export function defaultRemove(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { selection } = state;
  const { $from, $to } = selection;
  if ($from.pos === $to.pos) {
    const tr = state.tr.delete($from.pos - 1, $from.pos);
    if (dispatch) dispatch(tr);
    return true;
  }
  return false;
}

export const basicTraakAddCommands = chainCommands(addLineFromTitle, addLine);
export const basicTraakRemoveCommands = chainCommands(
  removeLineNode,
  joinTwoLines,
  defaultRemove,
  removeSelection,
);
