import { TraakNode } from '../../types/traak-node';

export const OrderedList: TraakNode = {
  type: 'ordered_list',
  spec: {
    content: 'list_item*',
    group: 'block',
    toDOM() {
      return ['ol', 0];
    },
    parseDOM: [{ tag: 'ol' }],
  },
};
