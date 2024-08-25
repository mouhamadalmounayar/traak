import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { chainCommands } from 'prosemirror-commands';
import { ResolvedPos, Node } from 'prosemirror-model';

const isCursorAtTheBeginningOfNode = ($pos: ResolvedPos): boolean => {
  return $pos.pos === $pos.before() + 1;
};

const isNodeEmpty = (node: Node): boolean => {
  return node.content.size === 0;
};

const isNodeAfterTitlePresent = ($pos: ResolvedPos): boolean => {
  return $pos.parent.nodeSize + 1 < $pos.doc.content.size;
};

/**
 * adds an empty lineNode to the document.
 */
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

/**
 * adds a line from the title node, without splitting the title node.
 */
export function addLineFromTitle(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { schema, selection } = state;
  const { $from } = selection;
  if ($from.node().type.name === 'doc_title') {
    if (isNodeAfterTitlePresent($from)) {
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

/**
 * adds a list item to a list that is in the document
 */
export function addListItem(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { selection, schema } = state;
  const { $from } = selection;
  if (selection.empty && $from.parent.type.name === 'list_item') {
    const ListItemNode = schema.nodes['list_item'].create();
    const tr = state.tr.insert($from.pos, ListItemNode);
    const newPos = $from.pos + ListItemNode.nodeSize;
    tr.setSelection(TextSelection.create(tr.doc, newPos, newPos));
    if (dispatch) {
      dispatch(tr);
      return true;
    }
  }
  return false;
}

/**
 * removes a line node from the document if the line is empty and the cursor is at the beginning of the line.
 */
export function removeLineNode(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { selection } = state;
  const { $from } = selection;
  const currNode = $from.parent;
  if (
    selection.empty &&
    isCursorAtTheBeginningOfNode($from) &&
    isNodeEmpty(currNode)
  ) {
    const tr = state.tr.delete($from.pos - 1, $from.pos);
    if (dispatch) dispatch(tr);
    return true;
  }
  return false;
}

/**
 * removes a list item if it's empty.
 */

export function exitList(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { selection, schema } = state;
  const { $from } = selection;
  if (
    $from.parent.type.name === 'list_item' &&
    isCursorAtTheBeginningOfNode($from) &&
    isNodeEmpty($from.parent)
  ) {
    let tr = state.tr.delete($from.pos - 1, $from.pos);
    const lineNode = schema.nodes['line'].create();
    tr = tr.insert($from.pos, lineNode);
    /*
     * move the cursor to the end of the line.
     */
    tr.setSelection(
      TextSelection.create(
        tr.doc,
        $from.pos + lineNode.nodeSize - 1,
        $from.pos + lineNode.nodeSize - 1,
      ),
    );
    if (dispatch) {
      dispatch(tr);
      return true;
    }
  }
  return false;
}

/**
 * lifts a list item out of a list and copies its content to a new line
 */
export function liftList(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { schema, selection } = state;
  const { $from } = selection;
  if (
    isCursorAtTheBeginningOfNode($from) &&
    $from.parent.type.name === 'list_item'
  ) {
    const textContent = $from.parent.textContent;
    let tr = state.tr.delete($from.pos - 1, $from.pos + $from.parent.nodeSize);
    const lineNode = schema.nodes['line'].create(
      null,
      schema.text(textContent || ''),
    );
    tr = tr.insert($from.pos, lineNode);
    if (dispatch) dispatch(tr);
    return true;
  }
  return false;
}

/**
 * joins two line nodes.
 */
export function joinTwoLines(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { selection } = state;
  const { $from } = selection;
  if (selection.empty && isCursorAtTheBeginningOfNode($from)) {
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

/**
 * removes a non empty selection from the document.
 */
export function removeSelection(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
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

/**
 * adds a bullet_list node to the document
 */
export function addList(
  listType: string,
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { selection, schema } = state;
  const { from } = selection;
  const listItemNode = schema.nodes['list_item'].create();
  const bulletListNode = schema.nodes[listType].create(null, listItemNode);
  const tr: Transaction = state.tr.insert(from, bulletListNode);
  if (dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
}

export const basicTraakAddCommands = chainCommands(
  addLineFromTitle,
  addListItem,
  addLine,
);
export const basicTraakRemoveCommands = chainCommands(
  exitList,
  liftList,
  removeLineNode,
  joinTwoLines,
  defaultRemove,
  removeSelection,
);
