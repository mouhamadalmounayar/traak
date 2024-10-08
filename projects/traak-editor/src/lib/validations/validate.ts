import { TraakConfiguration } from '../../types/traak-configuration';
import { traakConfigurationSchema } from './validation.schema';
import { ConfigError } from '../../errors';
import { INCOMPATIBLE_NODES_WITH_STARTERS } from '../../strings';

export function validateGlobalConfig(config: TraakConfiguration) {
  const validationResult = traakConfigurationSchema.safeParse(config);
  if (!validationResult.success) {
    throw new ConfigError(INCOMPATIBLE_NODES_WITH_STARTERS);
  }
  return;
}
