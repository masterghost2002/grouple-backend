import * as z from 'zod';
const deleteMovieDataValidator = z.object({
    movieId:z.string()
});
export type deleteMovieDataType = z.infer<typeof deleteMovieDataValidator>;
export default deleteMovieDataValidator;