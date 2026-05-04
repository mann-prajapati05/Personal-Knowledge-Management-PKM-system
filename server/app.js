import 'dotenv/config';

import express from 'express'

import { initializeDatabase } from './db/init.js';
await initializeDatabase();

const app=express();

app.use('/',(req,res,next)=>{
    console.log(req.url,req.method);
    next();
})

const PORT=process.env.PORT || 4041;
app.listen(PORT,()=>{
    console.log(`Running on http://localhost:${PORT}`);
});