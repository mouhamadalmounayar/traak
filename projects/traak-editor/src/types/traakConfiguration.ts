import { TraakNode } from './traakNode';

export type Coordinates = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type TraakConfiguration = {
  useStarters: boolean;
  nodes: TraakNode[];
};
