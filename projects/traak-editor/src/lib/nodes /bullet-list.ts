import { TraakNode } from '../../types/traak-node';

export const BulletList: TraakNode = {
  type: 'bullet_list',
  spec: {
    content: 'list_item*',
    group: 'block',
    toDOM() {
      return ['ul', 0];
    },
    parseDOM: [{ tag: 'ul' }],
  },
};
