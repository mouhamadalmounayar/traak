import { Component } from '@angular/core';
import { WrapperComponent } from 'traak-editor';
import { ToolTipComponent } from 'traak-editor';
import { TraakConfiguration } from '../../../projects/traak-editor/src/public-api';
@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [WrapperComponent, ToolTipComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent {
  config: TraakConfiguration = {
    useStarters : true,
    nodes: [],
  };
}
