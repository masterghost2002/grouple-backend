import express, { Response } from 'express';
import cors from 'cors';
import authRouter from './router/auth.router';
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/helloworld', (_, res:Response)=>res.status(200).json('Hello World'));
app.listen(PORT, ()=>console.log('Server is listening to port ', PORT));