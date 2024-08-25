import { Schema } from 'prosemirror-model';

export const schema = new Schema({
  nodes: {
    list_item: {
      content: 'text*',
      toDOM() {
        return ['li', 0];
      },
      parseDOM: [{ tag: 'li' }],
      defining: true,
    },
    bullet_list: {
      content: 'list_item*',
      toDOM() {
        return ['ul', 0];
      },
      parseDOM: [{ tag: 'ul' }],
    },
    ordered_list: {
      content: 'list_item*',
      toDOM() {
        return ['ol', 0];
      },
      parseDOM: [{ tag: 'ol' }],
    },
    doc_title: {
      content: 'text*',
      toDOM() {
        return ['h1', 0];
      },
      parseDOM: [{ tag: 'h1' }],
    },
    text: {},
    line: {
      content: 'text*',
      toDOM() {
        return ['p', 0];
      },
      parseDOM: [{ tag: 'p' }],
    },
    doc: {
      content: 'doc_title (line|bullet_list|ordered_list)*',
    },
  },
  marks: {
    bold: {
      toDOM() {
        return ['strong', 0];
      },
      parseDOM: [{ tag: 'strong' }],
    },
    italic: {
      toDOM() {
        return ['i', 0];
      },
      parseDOM: [{ tag: 'i' }],
    },
    strikethrough: {
      toDOM() {
        return ['s', 0];
      },
      parseDOM: [{ tag: 's' }],
    },
    code: {
      toDOM() {
        return ['code', 0];
      },
      parseDOM: [{ tag: 'code' }],
    },
    link: {
      attrs: {
        href: {},
      },
      inclusive: false,
      toDOM(node) {
        const { href } = node.attrs;
        return ['a', { href }, 0];
      },
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom) {
            return { href: dom.getAttribute('href') };
          },
        },
      ],
    },
  },
});
