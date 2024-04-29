import { Router } from "express";
import CREATE_USER from '../controllers/auth/sign-up/route';
import GET_USER from '../controllers/auth/sign-in/route';
const authRouter = Router();
authRouter.post('/sign-up', CREATE_USER);
authRouter.post('/sign-in', GET_USER);
export default authRouter;
