import { Component } from '@angular/core';
import { WrapperComponent } from 'traak-editor';
import { ToolTipComponent } from 'traak-editor';
import { TraakConfiguration } from 'traak-editor';
import { MenuComponent } from 'traak-editor';
@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [WrapperComponent, ToolTipComponent, MenuComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent {
  config: TraakConfiguration = {
    useStarters: true,
    nodes: [],
  };
}
