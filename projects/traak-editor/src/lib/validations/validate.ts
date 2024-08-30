import {TraakConfiguration} from "../../types/traakConfiguration";
import {traakConfigurationSchema} from "./validation.schema.";


export function validate(config: TraakConfiguration) {
  const validationResult = traakConfigurationSchema.safeParse(config);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return;
}
