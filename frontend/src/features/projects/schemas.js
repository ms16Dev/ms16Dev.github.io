import { z } from 'zod';

export const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    description: z.string().optional(),
    tags: z.string().optional(),
    background_image_url: z.string().url("Must be a valid URL").optional().or(z.literal(''))
});
