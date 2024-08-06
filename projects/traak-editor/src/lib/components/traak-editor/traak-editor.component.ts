import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { EditorState, Transaction } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ViewChild } from '@angular/core';
import { traakSchema } from '../../builtins/schemas';
import { traakStarter } from '../../builtins/starters';
import {
  basicTraakAddCommands,
  basicTraakRemoveCommands,
} from '../../builtins/commands/index';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';
import { inputRules } from 'prosemirror-inputrules';
import {BOLD, CODE, ITALIC, STRIKETHROUGH} from '../../builtins/inputRules/regexExp';
import { markInputRule } from '../../builtins/inputRules';

@Component({
  selector: 'lib-traak-editor',
  standalone: true,
  imports: [],
  template: ` <div #editor></div> `,
  styles: ``,
})
export class TraakEditorComponent implements AfterViewInit {
  @ViewChild('editor') editor?: ElementRef;
  @Output() viewEvent = new EventEmitter<EditorView>();
  @Output() transactionEvent = new EventEmitter<Transaction>();


  initializeEditor(): void {
    const schema = traakSchema;
    if (schema) {
      const state = EditorState.create({
        doc: Node.fromJSON(schema, traakStarter),
        plugins: [
          inputRules({
            rules: [
              markInputRule(BOLD, schema.marks.bold),
              markInputRule(ITALIC, schema.marks.italic),
              markInputRule(STRIKETHROUGH, schema.marks.strikethrough),
              markInputRule(CODE, schema.marks.code)
            ],
          }),
        ],
      });
      const view = new EditorView(this.editor?.nativeElement, {
        state: state,
        dispatchTransaction: (tr) => {
          const newState = view.state.apply(tr);
          this.transactionEvent.emit(tr);
          view.updateState(newState);
          this.viewEvent.emit(view);
        },
        plugins: [
          keymap({
            Enter: basicTraakAddCommands,
            Backspace: basicTraakRemoveCommands,
            'Ctrl-b': toggleMark(schema.marks['bold']),
          }),
        ],
      });
    }
  }

  ngAfterViewInit() {
    this.initializeEditor();
  }
}
