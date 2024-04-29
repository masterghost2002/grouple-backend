import z from 'zod';
// export const PageSchema = z.string().refine(value => {
//     const num = Number(value);
//     if (isNaN(num)) throw new Error('Page must be a number');
//     if (num < 1) throw new Error('Page must be at least 1');
//     return true;
// }, { message: 'Invalid page number' });

// export const LimitSchema = z.string().refine(value => {
//     const num = Number(value);
//     if (isNaN(num)) throw new Error('Limit must be a number');
//     if (num < 1) throw new Error('Limit must be at least 1');
//     return true;
// }, { message: 'Invalid limit number' });
export const OrderSchema = z.enum(['asc', 'desc']).default('asc');
export const querySchema = z.object({
    page:z.number().int().min(1),
    limit:z.number().int().min(1).max(10),
    order:z.enum(['asc', 'desc']).default('asc')
})