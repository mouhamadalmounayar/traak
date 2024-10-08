import { MarkType, Node } from 'prosemirror-model';
import { TraakNode } from '../types/traak-node';

export function hasMark(
  doc: Node,
  markType: MarkType,
  from: number,
  to: number,
) {
  let result = false;
  doc.nodesBetween(from, to, (node: Node) => {
    if (node.marks.some((mark) => mark.type === markType)) result = true;
  });
  return result;
}

export function findNodeByName(nodes: TraakNode[], type: string) {
  for (const node of nodes) {
    if (node.type === type) {
      return true;
    }
  }
  return false;
}
