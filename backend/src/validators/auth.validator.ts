import { z } from 'zod'

export const loginInputSchema = z.object({ password: z.string().min(1).max(200) })
