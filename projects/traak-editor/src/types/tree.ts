import { Node, Schema } from 'prosemirror-model';

export class Tree {
  root: string;
  left!: Tree;
  right!: Tree;
  schema: Schema;

  constructor(root: string, schema: Schema, left?: Tree, right?: Tree) {
    this.root = root;
    this.left = left;
    this.right = right;
    this.schema = schema;
  }

  /**
   * iterates through the tree of nodeTypes and creates the node
   */

  //handle the text node
  createNode(): Node {
    if (!this.left && !this.right) {
      return this.schema.nodes[this.root].create();
    }

    if (!this.left) {
      return this.schema.nodes[this.root].create(null, [
        this.right.createNode(),
      ]);
    }
    if (!this.right) {
      return this.schema.nodes[this.root].create(null, [
        this.left.createNode(),
      ]);
    }

    return this.schema.nodes[this.root].create(null, [
      this.left.createNode(),
      this.right.createNode(),
    ]);
  }
}
