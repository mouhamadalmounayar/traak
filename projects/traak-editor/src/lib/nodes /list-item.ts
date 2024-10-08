import { TraakNode } from '../../types/traak-node';

export const ListItem: TraakNode = {
  type: 'list_item',
  spec: {
    content: 'text*',
    group: 'block',
    toDOM() {
      return ['li', 0];
    },
    parseDOM: [{ tag: 'li' }],
  },
};
