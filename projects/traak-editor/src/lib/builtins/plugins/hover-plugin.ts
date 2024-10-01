import { Plugin } from 'prosemirror-state';

export const hoverPlugin = new Plugin({
  props: {
    handleDOMEvents: {
      mouseover(view, event) {
        const NON_HOVERABLE_NODES = [
          'doc_title',
          'list_item',
          'bullet_list',
          'ordered_list',
          'task_list',
        ];
        const target = event.target as HTMLElement;
        const posInDom = view.posAtDOM(target, 0);
        const $posInDom = view.state.doc.resolve(posInDom);
        if ($posInDom.pos === 0) {
          return;
        }
        // check if we are nested in a non hoverable node
        if (NON_HOVERABLE_NODES.includes($posInDom.node(1).type.name)) {
          return;
        }
        // check if we are in a non hoverable node
        if (NON_HOVERABLE_NODES.includes($posInDom.parent.type.name)) {
          return;
        }
        const start = $posInDom.start();
        const node = $posInDom.parent;
        const dims = view.coordsAtPos(start);
        target.dispatchEvent(
          new CustomEvent('nodeHover', {
            bubbles: true,
            detail: { dims: dims, node: node, start: start },
          }),
        );
      },
      mouseleave(view, event) {
        const target = event.target as HTMLElement;
        target.dispatchEvent(
          new CustomEvent('nodeOut', {
            bubbles: true,
            detail: { event: 'out' },
          }),
        );
      },
    },
  },
});
