import { z } from 'zod';

export const PostSchema = z.object({
    title: z
        .string({
            required_error: 'Title is required',
        })
        .trim()
        .min(1, 'Title cannot be empty'),
    body: z
        .string({
            required_error: 'Body is required',
        })
        .trim()
        .min(1, 'Body cannot be empty'),
    userId: z.number({
        required_error: 'UserId is required',
    }),
});

const HasID = z.object({ id: z.string() });

const PostWithId = PostSchema.merge(HasID);

export type Post = z.infer<typeof PostWithId>;