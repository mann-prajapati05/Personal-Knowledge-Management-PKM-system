import dotenv from 'dotenv'
import express from 'express'

dotenv.config();
const app=express();

app.use('/',(req,res,next)=>{
    console.log(req.url,req.method);
})

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Running on http://localhost:${PORT}`);
});