import { Router } from "express";
import BOOK_TICKET from '../controllers/tickets/book-ticket/route';
import auth from "../middlewares/auth/auth.middleware";
const ticketRouter = Router();
ticketRouter.post('/book-ticket',auth.validateUser, BOOK_TICKET);
export default ticketRouter;
