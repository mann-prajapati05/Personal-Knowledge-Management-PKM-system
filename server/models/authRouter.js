import express from 'express';

import { register, login, me, logout } from '../controllers/authController.js';

const authRouter=express.Router();

authRouter.post("/login",login);
authRouter.post("/register",register);
authRouter.get('/me', me);
authRouter.post('/logout', logout);

export default authRouter;