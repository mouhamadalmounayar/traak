import { NodeSpec, Schema } from 'prosemirror-model';

export const traakSchema = new Schema({
  nodes: {
    list_item: {
      content: 'text*',
      group: 'block',
      toDOM() {
        return ['li', 0];
      },
      parseDOM: [{ tag: 'li' }],
    },
    bullet_list: {
      content: 'list_item*',
      group: 'block',
      toDOM() {
        return ['ul', 0];
      },
      parseDOM: [{ tag: 'ul' }],
    },
    ordered_list: {
      content: 'list_item*',
      group: 'block',
      toDOM() {
        return ['ol', 0];
      },
      parseDOM: [{ tag: 'ol' }],
    },
    doc_title: {
      content: 'text*',
      group: 'block',
      toDOM() {
        return ['h1', 0];
      },
      parseDOM: [{ tag: 'h1' }],
    },
    text: {},
    line: {
      group: 'block',
      content: 'text*',
      toDOM() {
        return ['p', 0];
      },
      parseDOM: [{ tag: 'p' }],
    },
    doc: {
      content: 'block*',
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

export const baseSchema = new Schema({
  nodes: {
    text: {},
    line: {
      content: 'text*',
      group: 'block',
      toDOM() {
        return ['p', 0];
      },
      parseDOM: [{ tag: 'p' }],
    },
    doc: {
      content: 'block*',
    },
  },
});

export const createSchema = (schema: Schema, type: string, node: NodeSpec) => {
  const nodes = schema.spec.nodes.addToStart(type, node);
  return new Schema({ nodes: nodes });
};
