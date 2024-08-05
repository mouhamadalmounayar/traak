# traak 

## Overview 
 
Traak is an open source writing collaboration tool, currently under developement. It will feature a powerful text editor built on top of [ProseMirror](https://prosemirror.net/), with support for Markdown, collaborative editing, version control and more.

Traak's main goal is to make writing and publishing documentation easy, and free, that's it.  

## Developement Milestones
The first phase is to build the editor component using ProseMirror.

- [x] Implement a basic tooltip supporting essential text styles (bold, italic, strikethrough, and code).
- [x] Implement input rules for improved text editing.
- [ ] Extend the current schema to support code blocks, latex equations, ordered and unordered lists, tasks lists etc. 
- [ ] Implement drag and drop for links and images.

## Getting Started
To get the project up and running in developement mode on your local machine : 
1. Clone the repository : 
```sh 
git clone git@github.com:mouhamadalmounayar/traak.git
```

2. Run the editor's library : 
```sh
cd frontend/projects/traak-editor
ng build --watch
```
3. Run the angular's project : 
```sh
cd frontend 
ng serve
```
4. Navigate to the `http://localhost:4200/editor` to interact with the current version of the editor.
## Core concepts
Traak's frontend is built using Angular, and uses the traak-editor library.
This library contains two main components: 
- `TraakEditorComponent` : The component that leverages ProseMirror modules to build the editor.
- `WrapperComponent` : The component that wraps the editor in order to link it with external functionalities such as the menu. 

The `TraakEditorComponent` creates the prosemirror view and passes a reference of it to the `WrapperComponent`. It also forwards dispatched transactions, enabling external components to interact with the editor.

The `builtins` directory includes components essential for initializing the editor, such as ProseMirror commands, the ProseMirror schema, and the ProseMirror doc used as a starter document.

