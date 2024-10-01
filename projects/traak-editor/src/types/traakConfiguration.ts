import { Node } from 'prosemirror-model';
import { TraakNode } from './traakNode';

export type Coordinates = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type HoverEventDetails = {
  start: number;
  dims: Coordinates;
  node: Node;
};

export type OutEventDetails = {
  event: string;
};

export type ClickEventDetails = {
  type: string;
  domElement: HTMLElement;
};

export type TraakConfiguration = {
  useStarters: boolean;
  nodes: TraakNode[];
};
