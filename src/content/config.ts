import { defineCollection, z } from 'astro:content';

const experienceCollection = defineCollection({
  type: 'content',
  schema: z.object({
    role: z.string(),
    company: z.string(),
    period: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

const projectCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    url: z.string().url(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  experience: experienceCollection,
  projects: projectCollection,
};
