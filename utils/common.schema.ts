import z from 'zod';
export const OrderSchema = z.enum(['asc', 'desc']).default('asc');
export const querySchema = z.object({
    page:z.number().int().min(1).default(1),
    limit:z.number().int().min(1).max(100).default(1),
    order:z.enum(['asc', 'desc']).default('asc')
})