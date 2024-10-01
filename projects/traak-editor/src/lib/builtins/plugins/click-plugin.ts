import { Plugin } from 'prosemirror-state';

export const clickPlugin = new Plugin({
  props: {
    handleDOMEvents: {
      click(view, event) {
        const target = event.target as HTMLElement;
        const posInDom = view.posAtDOM(target, 0);
        const $posInDom = view.state.doc.resolve(posInDom);
        const node = $posInDom.parent;
        target.dispatchEvent(
          new CustomEvent('nodeClick', {
            bubbles: true,
            detail: { nodeType: node.type.name, domElement: target },
          }),
        );
      },
    },
  },
});
