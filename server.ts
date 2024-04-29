import express from 'express';
import cors from 'cors';
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());

app.listen(PORT, ()=>console.log('Server is listening to port ', PORT));