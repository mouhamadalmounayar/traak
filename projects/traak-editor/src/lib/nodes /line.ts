import { TraakNode } from '../../types/traak-node';

export const Line: TraakNode = {
  type: 'line',
  spec: {
    group: 'block',
    content: 'text*',
    toDOM() {
      return ['p', 0];
    },
    parseDOM: [{ tag: 'p' }],
  },
};
