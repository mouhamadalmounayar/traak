import { Plugin } from 'prosemirror-state';
export const hoverPlugin = new Plugin({
  props: {
    handleDOMEvents: {
      mouseover(view, event) {
        const { $from } = view.state.selection;
        const node = view.state.doc.nodeAt($from.pos);
        if (node) {
          const { target } = event;
          console.log('dispatching');
          target?.dispatchEvent(
            new CustomEvent('nodeHover', {
              detail: { Node: node, pos: $from.pos },
            }),
          );
        }
        return false;
      },
    },
  },
});
