import { BulletList } from '../../lib/nodes ';
import { validateGlobalConfig } from '../../lib/validations/validate';
import { ListItem } from '../../lib/nodes ';
import { TraakConfiguration } from '../../types/traak-configuration';
import { INCOMPATIBLE_NODES_WITH_STARTERS } from '../../strings';
import { ConfigError } from '../../errors';

describe('global editor configuration test', () => {
  it('should throw an error if use-starters is not compatible with nodes', () => {
    const config: TraakConfiguration = {
      useStarters: true,
      nodes: [ListItem, BulletList],
    };
    try {
      validateGlobalConfig(config);
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect(error.message).toEqual(INCOMPATIBLE_NODES_WITH_STARTERS);
    }
  });
});
