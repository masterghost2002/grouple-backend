import * as z from 'zod';
const signInForm = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message:"Password must be 8 char long"}).max(30, {message:"Password lenght should not exceed 30 char"})
});
export type signInFormType = z.infer<typeof signInForm>;
export default signInForm;