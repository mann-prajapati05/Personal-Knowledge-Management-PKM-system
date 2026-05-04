import express, { Router } from 'express';
import { userLogin } from '../controllers/userController';
const userRouter=express.Router();

userRouter.post("/api/login",userLogin);