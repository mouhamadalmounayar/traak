import { Plugin } from 'prosemirror-state';

export const hoverPlugin = new Plugin({
  props: {
    handleDOMEvents: {
      mouseover(view, event) {
        const target = event.target as HTMLElement;
        const posInDom = view.posAtDOM(target, 0);
        const $posInDom = view.state.doc.resolve(posInDom);
        if ($posInDom.pos === 0) {
          return;
        }
        if ($posInDom.parent.type.name === 'doc_title') {
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
      mouseout(view, event) {
        const target = event.target as HTMLElement;
        target.dispatchEvent(
          new CustomEvent('nodeOut', {
            bubbles: true,
          }),
        );
      },
    },
  },
});
