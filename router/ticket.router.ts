import { Router } from "express";
import BOOK_TICKET from '../controllers/tickets/book-ticket/route';
import GET_TICKETS from '../controllers/tickets/get-tickets/userId/route'
import auth from "../middlewares/auth/auth.middleware";
const ticketRouter = Router();
ticketRouter.use(auth.validateUser);
ticketRouter.post('/book-ticket', BOOK_TICKET);
ticketRouter.get('/my-tickets', GET_TICKETS);
export default ticketRouter;
