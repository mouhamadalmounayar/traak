import z from 'zod';
import { INCOMPATIBLE_NODES_WITH_STARTERS } from '../../strings';

export const traakNodeSchema = z.object({
  type: z.string().optional(),
  spec: z.unknown(),
});

export const traakConfigurationSchema = z
  .object({
    useStarters: z.boolean(),
    nodes: z.array(traakNodeSchema),
  })
  .refine((data) => data['useStarters'] !== (data['nodes'].length !== 0), {
    message: INCOMPATIBLE_NODES_WITH_STARTERS,
  });
