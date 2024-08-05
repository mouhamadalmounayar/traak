import { createState, createView } from './test-utils';
import { beforeEach } from '@jest/globals';
import { traakSchema } from '../src/lib/builtins/schemas';
import { traakStarter } from '../src/lib/builtins/starters';
import { createMenu } from '../src/lib/builtins/menu';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';

describe('create menu', () => {
  let view: EditorView;
  let state: EditorState;
  let template;
  let menu;

  beforeEach(() => {
    document.body.innerHTML = '<div id="editor"></div>';
    template = document.querySelector('#editor');
    state = createState(traakSchema, traakStarter);
    if (template) view = createView(state, template);
  });

  it('creates a menu correctly', () => {
    menu = createMenu(view);
    const items = menu.querySelectorAll('.menu-element');
    expect(items.length).toBe(4);
  });
});
