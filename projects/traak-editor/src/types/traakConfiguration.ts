import { Node } from 'prosemirror-model';
import { TraakPlugin } from '../lib/traakPlugins/TraakPlugin';

export type Coordinates = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type TraakConfiguration = {
  useStarterSchema: boolean;
  useStarterDoc: boolean;
  traakPlugins: TraakPlugin[];
  nodes: Node[];
};
