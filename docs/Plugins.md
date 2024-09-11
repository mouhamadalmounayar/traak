# Plugins

You can customize the editor by using `plugins`. The library comes with already defined plugins. You can also create your own.

## Tooltip

The tooltip plugin adds a tooltip to your editor that appears when a selection is made.

1. Import the `ToolTipComponent`

```ts
import {ToolTipComponent} from "traak-editor";
```

2. Add it to the template

```html

<wrapper [config]="this.config">
  <tooltip></tooltip>
</wrapper>
```

## BlockMenu

The blockMenu plugin adds a menu to your editor that appears when hovering over a node. The menu allows you
to alter the document's state (add paragraphs, lists, etc ...)

1. Import the `MenuComponent`

```ts
import {MenuComponent} from "traak-editor"
```

2. Add it to the template

```html 

<lib-wrapper [config]="this.config">
  <block-menu></block-menu>
</lib-wrapper>
```

## Build your own plugins

Plugins are where you should write code to interact with the editor.  
The `TraakPlugin` abstract class provides a framework for creating plugins for your editor. It includes properties and
methods that are essential for you to build a functional `plugin`.

### TraakPlugin

```ts
export abstract class TraakPlugin {
  /**
   * Holds a reference to the editor view.
   * You should pass this as the only argument to the utility methods.
   */
  abstract view?: EditorView;
  /**
   * Holds a reference to the current transaction. (set of changes being made in the editor)
   * Is automatically used to update the view.
   */
  abstract currentTransaction?: Transaction;
  /**
   * Holds the coordinates for positioning your plugin relatively to the editor.
   */
  abstract coordinates?: Coordinates;
  /**
   * Holds a boolean to track whether a plugin is currently visible.
   */
  abstract isPluginVisible: boolean;

  /**
   * Called each time the view is updated. It will be triggered after every DOM change.
   */
  abstract updatePlugin(): void;
}
```

**Example** :

Let's say you want to build a plugin to count and display the number of words for each node in the document.

1. Create the component

```shell
ng g c word-counter --skip-tests
```

2. Provide the `TraakPlugin` :

```typescript
// wrapper.component.ts
@Component({
  selector: 'word-number',
  standalone: true,
  imports: [NgIf],
  providers: [
    {
      provide: TraakPlugin,
      useExisting: forwardRef(() => WordNumberComponent),
    },
  ],
  templateUrl: './word-number.component.html',
  styleUrl: './word-number.component.css',
})
```

This step is necessary so that the library picks up your component as a plugin.
Thus, calling the necessary methods to update the DOM.

3. Write the `updateWordCount()` method

```typescript 
// wrapper.component.ts
updateWordCount(): void {
  if(this.view){
    const content = getTextContent(this.view);
    const wordCount = content.trim().split(/\s+/).length;
    this.wordCount = wordCount;
  }
}
```
We call the `getTextContent()` utility that returns a string with the text contained in the current node.  
We want this method to be called each time the DOM is altered. (Each time a letter is written or a word is written). 
To achieve this, all you need to do is to put it inside the `updatePlugin()` method.

```typescript
// wrapper.component.ts
updatePlugin() : void {
  this.updateWordCount();
}
```

All put together the component looks like this : 
```typescript
@Component({
  selector: 'word-number',
  standalone: true,
  imports: [NgIf],
  providers: [
    {
      provide: TraakPlugin,
      useExisting: forwardRef(() => WordNumberComponent),
    },
  ],
  templateUrl: './word-number.component.html',
  styleUrl: './word-number.component.css',
})
export class WordNumberComponent extends TraakPlugin implements OnInit {
  view?: EditorView;

  currentTransaction?: Transaction;

  coordinates?: Coordinates;

  isPluginVisible: boolean = true;

  wordCount: number = 0;

  ngOnInit(): void {
    this.updateWordCount();
  }

  updateWordCount(): void {
    if (this.view) {
      const content = getTextContent(this.view);
      const wordCount = content.trim().split(/\s+/).length;
      this.wordCount = wordCount;
    }
  }

  updatePlugin(): void {
    this.updateWordCount();
  }
}

```





