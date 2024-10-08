import { TraakNode } from '../../types/traak-node';

export const TaskList: TraakNode = {
  type: 'task_list',
  spec: {
    content: 'task_checkbox line*',
    group: 'block',
    toDOM() {
      return ['div', { class: 'task-list' }, 0];
    },
  },
};
