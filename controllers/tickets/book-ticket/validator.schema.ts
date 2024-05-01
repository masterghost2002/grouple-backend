import * as z from 'zod';
const bookTicketDataValidator = z.object({
    movieId:z.string(),
    value:z.number().min(1)
});
export type bookTicketDataType = z.infer<typeof bookTicketDataValidator>;
export default bookTicketDataValidator;