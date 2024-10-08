import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { EditorState, Transaction } from 'prosemirror-state';
import { Node, Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ViewChild } from '@angular/core';
import { baseSchema, createSchema, traakSchema } from '../../builtins/schemas';
import { baseStarter, traakStarter } from '../../builtins/starters';
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
} from '../../builtins/input-rules/regexExp';
import { markInputRule } from '../../builtins/input-rules';
import { clickPlugin, hoverPlugin } from '../../builtins/plugins';
import { TraakConfiguration } from '../../../types/traak-configuration';
import { TraakNode } from '../../../types/traak-node';

@Component({
  selector: 'lib-traak-editor',
  standalone: true,
  imports: [],
  template: ` <div #editor test-id="editor"></div> `,
  styleUrls: ['./traak-editor.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TraakEditorComponent implements AfterViewInit {
  @ViewChild('editor') editor?: ElementRef;
  @Output() viewEvent = new EventEmitter<EditorView>();
  @Output() transactionEvent = new EventEmitter<Transaction>();
  @Output() nodeHoverEvent = new EventEmitter();
  @Output() nodeOutEvent = new EventEmitter();
  @Output() nodeClickEvent = new EventEmitter();
  @Input() config?: TraakConfiguration;

  constructor() {}

  initializeEditor(): void {
    if (this.config) {
      const schema = this.initializeSchema(this.config);
      const doc = this.initializeDoc(this.config, schema);
      const state = EditorState.create({
        doc: doc,
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
          clickPlugin,
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

  initializeSchema(config: TraakConfiguration): Schema {
    let schema: Schema;
    if (config.useStarters) schema = traakSchema;
    else {
      schema = config.nodes.reduce((acc: Schema, curr: TraakNode) => {
        const newSchema = createSchema(acc, curr.type, curr.spec);
        acc = newSchema;
        return acc;
      }, baseSchema);
    }
    schema = traakSchema;
    return schema;
  }

  initializeDoc(config: TraakConfiguration, schema: Schema): Node {
    let doc;
    if (config.useStarters) doc = Node.fromJSON(schema, traakStarter);
    else {
      doc = Node.fromJSON(schema, baseStarter);
    }
    return doc;
  }

  @HostListener('nodeHover', ['$event'])
  handleNodeHover($event: CustomEvent) {
    this.nodeHoverEvent.emit($event);
  }

  @HostListener('nodeOut', ['$event'])
  handleNodeOut($event: CustomEvent) {
    this.nodeOutEvent.emit($event);
  }

  @HostListener('nodeClick', ['$event'])
  handleNodeClick($event: CustomEvent) {
    this.nodeClickEvent.emit($event);
  }
}
