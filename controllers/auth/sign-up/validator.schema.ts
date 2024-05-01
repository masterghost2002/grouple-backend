import * as z from 'zod';
const signUpForm = z.object({
    first_name: z.string().min(3, {message:'First name should not be less than 3 char'}).max(20, {message:'First name must not exceed 20 chars'}),
    last_name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8, {message:"Password must be 8 char long"}).max(30, {message:"Password lenght should not exceed 30 char"})
});
export type signUpFormType = z.infer<typeof signUpForm>;
export default signUpForm;