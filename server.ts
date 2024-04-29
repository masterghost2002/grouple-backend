import express, { Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './router/auth.router';
import ticketRouter from './router/ticket.router';
import movieRouter from './router/movie.router';
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', authRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/movies', movieRouter);
app.use('/api/helloworld', (_, res:Response)=>res.status(200).json('Hello World'));
app.listen(PORT, ()=>console.log('Server is listening to port ', PORT));