import { createServer } from 'http';
import express, { Response } from 'express';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './router/auth.router';
import ticketRouter from './router/ticket.router';
import movieRouter from './router/movie.router';
import { initSocket } from './utils/socket-provider';
const PORT = process.env.PORT || 5000;
const app = express();
const httpServer = createServer(app);

//initilize the socket server
initSocket(httpServer);
const limit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(cors());
app.use(limit);
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/movies', movieRouter);
app.use('/api/helloworld', (_, res: Response) => res.status(200).json('Hello World'));
httpServer.listen(PORT, () => console.log('Server is listening to port ', PORT));