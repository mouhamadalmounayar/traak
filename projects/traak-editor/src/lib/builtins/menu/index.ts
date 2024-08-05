import { toggleMark } from 'prosemirror-commands';
import { traakSchema } from '../schemas';
import { EditorView } from 'prosemirror-view';

const selection = `<svg width="10px" height="auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M6 16C6 18.2091 7.79086 20 10 20H14C16.2091 20 18 18.2091 18 16C18 13.7909 16.2091 12 14 12M18 8C18 5.79086 16.2091 4 14 4H10C7.79086 4 6 5.79086 6 8M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>`;

const italic = `<svg width="10px" height="auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M19 4H10M14 20H5M15 4L9 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>
`;

const code = `<svg width="10px" height="auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M17 17L22 12L17 7M7 7L2 12L7 17M14 3L10 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>
`;

const bold = `<svg width="10px" height="auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 12H14C16.2091 12 18 10.2091 18 8C18 5.79086 16.2091 4 14 4H6V12ZM6 12H15C17.2091 12 19 13.7909 19 16C19 18.2091 17.2091 20 15 20H6V12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

export function createMenu(view: EditorView) {
  const menu = document.createElement('div');
  menu.className = 'menu';
  menu.innerHTML = `
    <button class="menu-element" id="bold"> ${bold} </button>
    <button class="menu-element" id="italic"> ${italic} </button>
    <button class="menu-element" id="strikethrough"> ${selection} </button>
    <button class="menu-element" id="code">${code}</button>
  `;
  const boldItem = menu.querySelector('#bold');
  const italicItem = menu.querySelector('#italic');
  const strikethroughItem = menu.querySelector('#strikethrough');
  const codeItem = menu.querySelector('#code');

  boldItem?.addEventListener('mousedown', (e) => {
    e.preventDefault();
  });
  italicItem?.addEventListener('mousedown', (e) => {
    e.preventDefault();
  });

  boldItem?.addEventListener('click', (e) => {
    e.preventDefault();
    const command = toggleMark(traakSchema.marks.bold);
    command(view.state, view.dispatch);
  });
  italicItem?.addEventListener('click', (e) => {
    e.preventDefault();
    const command = toggleMark(traakSchema.marks.italic);
    command(view.state, view.dispatch);
  });
  strikethroughItem?.addEventListener('click', (e) => {
    e.preventDefault();
    const command = toggleMark(traakSchema.marks.strikethrough);
    command(view.state, view.dispatch);
  });
  codeItem?.addEventListener('click', (e) => {
    e.preventDefault();
    const command = toggleMark(traakSchema.marks.code);
    command(view.state, view.dispatch);
  });
  return menu;
}
