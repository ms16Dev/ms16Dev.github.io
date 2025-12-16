import { z } from 'zod';

export const projectSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),

    start_date: z
      .string()
      .min(1, 'Start date is required'),

    end_date: z
      .string()
      .min(1, 'End date is required'),

    description: z
      .string()
      .min(1, 'Description is required'),

    tags: z.string().optional(), // <-- only optional field

    github_link: z
    .string()
    .optional()
    .refine(
        val => !val || /^https?:\/\//.test(val),
        'Must be a valid URL'
    ),

    live_demo_link: z
    .string()
    .optional()
    .refine(
        val => !val || /^https?:\/\//.test(val),
        'Must be a valid URL'
    ),
    
    background_image: z
      .any()
      .refine(
        file => file && file.length > 0,
        'Background image is required'
      ),
  })
  .refine(
    data => {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end > start;
    },
    {
      message: 'End date must be later than start date',
      path: ['end_date'], // attach error to end_date field
    }
  );


  
export const aboutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),

  social_links: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      'Social links must be valid JSON'
    ),

    avatar_image: z
        .any()
        .refine(file => file instanceof File, "Avatar image is required"),
});



export const calendarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  icon: z.string().min(1, "Icon is required"),
}).refine(data => !data.start_date || !data.end_date || data.end_date >= data.start_date, {
  message: "End date must be the same or after start date",
  path: ["end_date"],
});


export const settingsSchema = z.object({
  calendar_start_year: z
    .number({ invalid_type_error: 'Start year is required' })
    .int()
    .min(2020, 'Start year cannot be less than 2020')
    .max(2050, 'Start year cannot be greater than 2050'),
  calendar_end_year: z
    .number({ invalid_type_error: 'End year is required' })
    .int()
    .min(2020, 'End year cannot be less than 2020')
    .max(2050, 'End year cannot be greater than 2050'),
}).refine(data => data.calendar_end_year >= data.calendar_start_year, {
  message: 'End year must be the same or after start year',
  path: ['calendar_end_year'],
});