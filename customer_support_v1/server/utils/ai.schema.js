import { z } from 'zod';

export const aiResponseSchema = z.object({
    intent: z.string(),
    trackingNumber: z.string().nullable(),
    requiresTool: z.boolean()
});