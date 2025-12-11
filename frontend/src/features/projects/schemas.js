import { z } from 'zod';

export const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    description: z.string().optional(),
    tags: z.string().optional(),
    github_link: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    live_demo_link: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    background_image: z.any().optional(),
});
