import { Node } from 'prosemirror-model';
import { TraakNode } from './traakNode';

export type Coordinates = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type EventDetails = {
  start: number;
  dims: Coordinates;
  node: Node;
};

export type TraakConfiguration = {
  useStarters: boolean;
  nodes: TraakNode[];
};
