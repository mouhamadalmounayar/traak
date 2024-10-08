import { TraakNode } from '../../types/traak-node';

export const DocTitle: TraakNode = {
  type: 'doc_title',
  spec: {
    content: 'text*',
    group: 'block',
    toDOM() {
      return ['h1', 0];
    },
    parseDOM: [{ tag: 'h1' }],
  },
};
