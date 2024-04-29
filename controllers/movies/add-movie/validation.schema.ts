import * as z from 'zod';
const addMovieDataValidator = z.object({
    name:z.string().min(3, {message:'Movie name must contain at leat 3 char'}).max(40, {message:'Movie name should not exceed 40 chars'}),
    show_time:z.date(),
    seat_available:z.number().min(1, {message:'At leat one seat should be there'})
});
export type addMovieDataType = z.infer<typeof addMovieDataValidator>;
export default addMovieDataValidator;