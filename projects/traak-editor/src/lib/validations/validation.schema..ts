import z from "zod"

export const traakNodeSchema = z.object({
  type : z.string().optional(),
  spec : z.unknown()
})

export const traakConfigurationSchema = z.object({
  useStarters : z.boolean(),
  nodes : z.array(traakNodeSchema)
}).refine(data => data['useStarters'] !== (data['nodes'].length !== 0))




