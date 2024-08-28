import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
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
import { inputRules } from 'prosemirror-inputrules';
import {
  BOLD,
  CODE,
  ITALIC,
  STRIKETHROUGH,
} from '../../builtins/inputRules/regexExp';
import { markInputRule } from '../../builtins/inputRules';
import { hoverPlugin } from '../../builtins/plugins';
import { TraakConfiguration } from '../../../types/traakConfiguration';

@Component({
  selector: 'lib-traak-editor',
  standalone: true,
  imports: [],
  template: ` <div #editor test-id="editor"></div> `,
  styles: '',
})
export class TraakEditorComponent implements AfterViewInit {
  @ViewChild('editor') editor?: ElementRef;
  @Output() viewEvent = new EventEmitter<EditorView>();
  @Output() transactionEvent = new EventEmitter<Transaction>();
  @Output() nodeHoverEvent = new EventEmitter();
  @Output() nodeOutEvent = new EventEmitter();
  @Input() config!: TraakConfiguration;

  constructor() {}

  initializeEditor(): void {
    const schema = traakSchema;
    if (schema) {
      const state = EditorState.create({
        doc: Node.fromJSON(schema, traakStarter),
        plugins: [
          inputRules({
            rules: [
              markInputRule(BOLD, schema.marks['bold']),
              markInputRule(ITALIC, schema.marks['italic']),
              markInputRule(STRIKETHROUGH, schema.marks['strikethrough']),
              markInputRule(CODE, schema.marks['code']),
            ],
          }),
        ],
      });
      const view = new EditorView(this.editor?.nativeElement, {
        state: state,
        dispatchTransaction: (tr) => {
          const newState = view.state.apply(tr);
          view.updateState(newState);
          this.transactionEvent.emit(tr);
          this.viewEvent.emit(view);
        },
        plugins: [
          hoverPlugin,
          keymap({
            Enter: basicTraakAddCommands,
            Backspace: basicTraakRemoveCommands,
          }),
        ],
      });
      this.viewEvent.emit(view);
    }
  }

  ngAfterViewInit() {
    this.initializeEditor();
  }

  @HostListener('nodeHover', ['$event'])
  handleNodeHover($event: CustomEvent) {
    this.nodeHoverEvent.emit($event);
  }

  @HostListener('nodeOut', ['$event'])
  handleNodeOut($event: CustomEvent) {
    this.nodeOutEvent.emit($event);
  }
}
