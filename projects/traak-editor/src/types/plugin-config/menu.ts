import { TraakNode } from '../traak-node';
import { PluginConfig } from './plugin-config';

export interface Menu extends PluginConfig {
  nodes: TraakNode[];
}
