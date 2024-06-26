import { createServer } from 'http';
import express, { NextFunction, Response, Request } from 'express';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './router/auth.router';
import ticketRouter from './router/ticket.router';
import movieRouter from './router/movie.router';
import userRouter from './router/user.route';
import { initSocket } from './utils/socket-provider';
import path from 'path';
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
app.use('/api',limit);
app.use(express.json());
app.use(cookieParser());

// will help to server the web
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) return next();
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path))
        return next();
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.sendFile(path.join(__dirname, './web/dist', 'index.html'));
});
app.use(express.static(path.join(__dirname, './web/dist')));
app.use('/api/auth', authRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/movies', movieRouter);
app.use('/api/user', userRouter);
app.use('/api/helloworld', (_, res: Response) => res.status(200).json('Hello World'));
httpServer.listen(PORT, () => console.log('Server is listening to port ', PORT));