import {MarkType, Node} from "prosemirror-model";

export function hasMark(doc: Node , markType: MarkType , from : number , to : number) {
    let result = false;
    doc.nodesBetween(from , to , (node : Node) => {
      if (node.marks.some(mark => mark.type === markType)) result = true;
    })
    return result;
}
