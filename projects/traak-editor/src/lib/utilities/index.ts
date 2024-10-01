import { EditorView } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';
import { ResolvedPos } from 'prosemirror-model';
import { Tree } from '../../types/tree';

export class TraakManager {
  constructor(private view: EditorView) {
    this.view = view;
  }

  updateView(view: EditorView): void {
    this.view = view;
  }

  private getResolvedPos(): ResolvedPos {
    const { state } = this.view;
    const { selection } = state;
    const { $from } = selection;
    return $from;
  }

  getNodeType(): string {
    const $nodePos = this.getResolvedPos();
    return $nodePos.parent.type.name;
  }

  /**
   * Returns the current node.
   */
  getNode() {
    const $nodePos = this.getResolvedPos();
    return $nodePos.parent;
  }

  /**
   * Returns the text content of the current node.
   */
  getTextContent(): string {
    const $nodePos = this.getResolvedPos();
    return $nodePos.parent.textContent;
  }

  /**
   * Returns true if the node is empty, false otherwise.
   */
  isNodeEmpty(): boolean {
    const $nodePos = this.getResolvedPos();
    return $nodePos.parent.content.size === 0;
  }

  /**
   * Returns true if the cursor is at the start of the current node.
   */
  isCursorAtStartOfNode(): boolean {
    const $nodePos = this.getResolvedPos();
    return $nodePos.pos === $nodePos.before() + 1;
  }

  /**
   * Dispatches a transaction that moves the cursor to the end of the current node.
   */
  moveCursorToEndOfNode() {
    if (!this.view) {
      throw new Error('EditorView is not set');
    }
    const { state } = this.view;
    const { tr } = state;
    const $nodePos = this.getResolvedPos();

    const endPos = $nodePos.start() + $nodePos.parent.nodeSize;
    tr.setSelection(TextSelection.create(tr.doc, endPos, endPos));
    this.view.dispatch(tr);
  }

  /**
   * Returns the coordinates of the current position in the document.
   */
  getSelectionCoords() {
    if (!this.view) {
      throw new Error('EditorView is not set');
    }
    const $nodePos = this.getResolvedPos();
    return this.view.coordsAtPos($nodePos.pos);
  }

  /**
   * Adds a node at the current selection.
   */
  addNode(tree: Tree) {
    if (!this.view) {
      throw new Error('EditorView is not set');
    }
    const $nodePos = this.getResolvedPos();
    const { state } = this.view;
    const { tr } = state;
    const node = tree.createNode();
    tr.insert($nodePos.pos, node);
    this.view.dispatch(tr);
  }
}
