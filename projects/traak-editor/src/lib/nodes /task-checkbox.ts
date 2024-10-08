import { TraakNode } from '../../types/traak-node';

export const TaskCheckbox: TraakNode = {
  type: 'task_checkbox',
  spec: {
    attrs: { checked: { default: 'false' } },
    selectable: true,
    group: 'block',
    toDOM(node) {
      if (node.attrs['checked'] === 'true') {
        return [
          'input',
          {
            type: 'checkbox',
            class: 'task-checkbox',
            checked: '',
          },
        ];
      }
      return [
        'div',
        {
          contenteditable: 'false',
        },
        [
          'input',
          {
            type: 'checkbox',
            class: 'task-checkbox',
          },
        ],
      ];
    },
    parseDOM: [
      {
        tag: 'input[type="checkbox"]',
        getAttrs(dom) {
          return {
            checked: dom.getAttribute('checked') === 'true',
          };
        },
      },
    ],
  },
};
