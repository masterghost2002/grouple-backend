import * as z from 'zod';
const cancelTicketDataValidator = z.object({
    ticketId:z.string(),
});
export type cancelTicketDataType = z.infer<typeof cancelTicketDataValidator>;
export default cancelTicketDataValidator;