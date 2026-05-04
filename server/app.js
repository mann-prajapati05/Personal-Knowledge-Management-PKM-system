import dotenv from 'dotenv/config';

import express from 'express'

import { initializeDatabase } from './db/init.js';
import { ensureBucketExists } from './config/minio.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

await initializeDatabase();

// Initialize MinIO asynchronously without blocking startup
ensureBucketExists().catch(err => {
  console.warn('⚠️ MinIO not available at startup:', err.message);
  console.warn('File uploads will not work until MinIO is running');
});

import userRouter from './routes/userRouter.js';
import authRouter from './models/authRouter.js';
import noteRouter from './routes/note.routes.js';

const app=express();

// parse JSON bodies
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/', (req, res, next) => {
    console.log(req.url, req.method);
    next();
});

app.use('/auth', authRouter);
app.use('/notes', noteRouter);

const PORT=process.env.PORT || 4041;
app.listen(PORT,()=>{
    console.log(`Running on http://localhost:${PORT}`);
});