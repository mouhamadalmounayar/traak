import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { chainCommands } from 'prosemirror-commands';
import { ResolvedPos, Node } from 'prosemirror-model';

const isCursorAtTheBeginningOfNode = ($pos: ResolvedPos): boolean => {
  return $pos.pos === $pos.before() + 1;
};

const isNodeEmpty = (node: Node): boolean => {
  return node.textContent.trim().length === 0;
};

const isNodeAfterTitlePresent = ($pos: ResolvedPos): boolean => {
  return $pos.parent.nodeSize + 1 < $pos.doc.content.size;
};
export function addNode(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  nodeType: string,
  content?: string,
) {
  const { schema, selection } = state;
  const { $from } = selection;
  const node = content
    ? schema.nodes[nodeType].create(null, schema.nodes[content].create())
    : schema.nodes[nodeType].create();
  if (node) {
    const tr = state.tr.insert($from.pos, node).scrollIntoView();
    const newPos = $from.pos + node.nodeSize;
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

export function addLine(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  return addNode(state, dispatch, 'line');
}

export function addListItem(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { selection } = state;
  const { $from } = selection;
  if ($from.parent.type.name === 'list_item')
    return addNode(state, dispatch, 'list_item');
  return false;
}

export function addOrderedList(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  return addNode(state, dispatch, 'ordered_list', 'list_item');
}

export function addBulletList(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  return addNode(state, dispatch, 'bullet_list', 'list_item');
}
/**
 * handles the case when the cursor is located in the title node.
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

export function removeNode(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  replacementNode?: string,
) {
  const { schema, selection } = state;
  const { $from } = selection;
  const currNode = $from.parent;
  const content = currNode.textContent;
  if (selection.empty && isCursorAtTheBeginningOfNode($from)) {
    let tr = state.tr.delete(
      $from.pos - 1,
      $from.pos + $from.parent.content.size,
    );
    if (replacementNode) {
      const node = schema.nodes[replacementNode].create(
        null,
        schema.text(content || ' '),
      );
      tr = tr.insert($from.pos, node);
    }
    if (dispatch) {
      dispatch(tr);
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
  const { $from } = selection;
  if (isNodeEmpty($from.parent) && $from.parent.type.name === 'line') {
    return removeNode(state, dispatch);
  }
  return false;
}

export function exitList(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { selection } = state;
  const { $from } = selection;
  if ($from.parent.type.name === 'list_item')
    return removeNode(state, dispatch, 'line');
  return false;
}

/**
 * joins two line nodes together.
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

export function defaultRemove(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
) {
  const { selection } = state;
  const { $from } = selection;
  if (selection.empty) {
    const tr = state.tr.delete($from.pos - 1, $from.pos);
    if (dispatch) dispatch(tr);
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
  removeLineNode,
  joinTwoLines,
  defaultRemove,
  removeSelection,
);
