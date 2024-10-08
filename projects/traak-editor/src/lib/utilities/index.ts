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

  /**
   *
   * @returns the current node type as a string
   */
  getNodeType(): string {
    const $nodePos = this.getResolvedPos();
    return $nodePos.parent.type.name;
  }

  /**
   *
   * @returns the node object on which the cursor is at
   */
  getNode() {
    const $nodePos = this.getResolvedPos();
    return $nodePos.parent;
  }

  /**
   *
   * @returns the text content on which cursor is at
   */
  getTextContent(): string {
    const $nodePos = this.getResolvedPos();
    return $nodePos.parent.textContent;
  }

  /**
   *
   * @returns true if the node on which the cursor is at is empty
   */
  isNodeEmpty(): boolean {
    const $nodePos = this.getResolvedPos();
    return $nodePos.parent.content.size === 0;
  }

  /**
   *
   * @returns true if cursor at the beginning of the node it is currently pointing at
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
   *
   * @returns the coordinates of the node on which the cursor is at.
   */
  getSelectionCoords() {
    if (!this.view) {
      throw new Error('EditorView is not set');
    }
    const $nodePos = this.getResolvedPos();
    return this.view.coordsAtPos($nodePos.pos);
  }

  /**
   * Dispatches a transaction that adds a node to the document
   * @param tree a traakTree that represent the node and its content
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
