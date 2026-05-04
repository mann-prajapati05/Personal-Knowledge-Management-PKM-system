import dotenv from 'dotenv/config';

import express from 'express'

import { initializeDatabase } from './db/init.js';
import cors from 'cors';

await initializeDatabase();

import userRouter from './routes/userRouter.js';
import authRouter from './models/authRouter.js';

const app=express();

// parse JSON bodies
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,
}));
app.use(express.json());

app.use('/', (req, res, next) => {
    console.log(req.url, req.method);
    next();
});

app.use('/auth', authRouter);

const PORT=process.env.PORT || 4041;
app.listen(PORT,()=>{
    console.log(`Running on http://localhost:${PORT}`);
});