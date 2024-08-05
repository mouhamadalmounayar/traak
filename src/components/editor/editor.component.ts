import { Component } from '@angular/core';
import { WrapperComponent } from 'traak-editor';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [WrapperComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent {}
