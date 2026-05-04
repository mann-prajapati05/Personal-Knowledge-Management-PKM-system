import express, { Router } from 'express';

import { register,login } from '../controllers/authController.js';
import { user } from '../controllers/userController.js';
const authRouter=express.Router();

authRouter.post("/login",login);
authRouter.post("/register",register);

export default authRouter;