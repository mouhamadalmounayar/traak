# Getting Started

Here are the steps you should take to get an editor up and running in your application. 

1. Create a configuration object for the editor.

```ts
import {TraakConfiguration} from 'traak-editor';

export class MainComponent {
  config: TraakConfiguration = {
    useStarters : true, 
    nodes: []
  };
}
```
- The `useStarters` parameter is set to `true`, indicating that you want to use the starter docs and schemas provided by the library.  
- The `nodes` array indicates what nodes you want to allow in the editor. If the starters are used, the `nodes` array should always be empty. 

2. Add the `wrapper` component to your template : 
```html
<div class="editor">
    <wrapper [config]="this.config"></wrapper>
</div>
```
The `config` defined earlier should be passed as an input to the `WrapperComponent`. 
